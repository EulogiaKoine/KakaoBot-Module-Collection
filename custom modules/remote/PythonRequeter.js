(function(){

function PythonRequester(host, port) {
    this.host = host || '127.0.0.1';
    this.port = port || 65432;
    this.socket = null;
    this.inputStream = null;
    this.outputStream = null;
    this.connected = false;
    
    // 요청 큐와 처리 스레드 관련
    this.requestQueue = new java.util.concurrent.LinkedBlockingQueue();
    this.processingThread = null;
    this.isProcessing = false;
    this.requestIdCounter = 0;
    this.pendingRequests = {}; // 요청 ID별 콜백 저장
}

// 요청 객체 생성자
function RequestItem(id, code, timeoutMs, callback, errorCallback) {
    this.id = id;
    this.code = code;
    this.timeoutMs = timeoutMs;
    this.callback = callback;
    this.errorCallback = errorCallback;
    // this.timestamp = java.lang.System.currentTimeMillis();
}

// 서버에 연결하는 메서드
PythonRequester.prototype.connect = function() {
    try {
        this.socket = new java.net.Socket();
        var socketAddress = new java.net.InetSocketAddress(this.host, this.port);
        
        // 연결 타임아웃 = 10s
        this.socket.connect(socketAddress, 10000);
        
        // 읽기 타임아웃 = 30s
        this.socket.setSoTimeout(30000);
        
        this.outputStream = this.socket.getOutputStream();
        this.inputStream = this.socket.getInputStream();
        this.connected = true;
        
        // 요청 처리 스레드 시작
        this.startProcessingThread();
        
        return true;
    } catch (e) {
        this.connected = false;
        throw new Error("Failed to connect to server: " + e.message);
    }
};

// 요청 처리 스레드 시작
PythonRequester.prototype.startProcessingThread = function() {
    if (this.processingThread && this.isProcessing)
        return; // 이미 실행 중
    
    this.isProcessing = true;
    var self = this;
    
    var processingRunnable = new java.lang.Runnable({
        run: function() {
            self.processRequestQueue();
        }
    });
    
    this.processingThread = new java.lang.Thread(processingRunnable);
    this.processingThread.setDaemon(true);
    this.processingThread.start();
};

// 요청 큐 처리 메서드
PythonRequester.prototype.processRequestQueue = function() {
    var self = this;
    
    while (this.isProcessing && this.connected) {
        try {
            // 요청 가져오기; 블로킹
            var request = this.requestQueue.take();

            if (!this.connected) {
                // 연결이 오류 => 에러 콜백 호출
                if (request.errorCallback)
                    request.errorCallback(new Error("Connection lost"));
                continue;
            }
            
            try {
                // 실제 요청 처리
                var result = this.executeCodeInternal(request.code, request.timeoutMs);
                if (request.callback) // 성공
                    request.callback(result);
            } catch (e) {
                if (request.errorCallback)
                    request.errorCallback(e);
                
                // 연결 오류, 연결 상태 업데이트
                if (e.message && (e.message.indexOf("Connection closed") !== -1 || 
                    e.message.indexOf("Socket closed") !== -1)) {
                    this.connected = false;
                }
            }
            
        } catch (e) {
            if (e instanceof java.lang.InterruptedException) {
                break;
            }
        }
    }
};

// 내부 코드 실행 메서드 (동기식)
PythonRequester.prototype.executeCodeInternal = function(code, timeoutMs) {
    if (!this.isConnected()) {
        throw new Error("Not connected to server");
    }
    
    timeoutMs = timeoutMs || 30000;
    var requestJson = JSON.stringify({
        timeout: timeoutMs / 1000,
        code: code
    });
    this.sendData(requestJson);
    var responseLength = this.readLengthPrefix();
    var responseJson = this.readData(responseLength);

    return JSON.parse(responseJson);
};

// 연결 상태 확인 메서드
PythonRequester.prototype.isConnected = function() {
    return this.connected && this.socket && !this.socket.isClosed();
};

// 4바이트 길이 프리픽스를 읽는 메서드
PythonRequester.prototype.readLengthPrefix = function() {
    var lengthBytes = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 4);
    var totalRead = 0;
    
    while (totalRead < 4) {
        var bytesRead = this.inputStream.read(lengthBytes, totalRead, 4 - totalRead);
        if (bytesRead === -1) {
            throw new Error("Connection closed while reading length prefix");
        }
        totalRead += bytesRead;
    }
    
    // 바이트 배열을 정수로 변환 (big-endian)
    var length = 0;
    for (var i = 0; i < 4; i++) {
        length = (length << 8) | (lengthBytes[i] & 0xFF);
    }
    
    return length;
};

// 지정된 길이만큼 데이터 읽기
PythonRequester.prototype.readData = function(length) {
    var dataBytes = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, length);
    var totalRead = 0;
    
    while (totalRead < length) {
        var bytesRead = this.inputStream.read(dataBytes, totalRead, length - totalRead);
        if (bytesRead === -1) {
            throw new Error("Connection closed while reading data");
        }
        totalRead += bytesRead;
    }

    return new java.lang.String(dataBytes, "UTF-8");
};

// 헤더 붙여서 전송
PythonRequester.prototype.sendData = function(data) {
    var dataBytes = new java.lang.String(data).getBytes("UTF-8");
    var length = dataBytes.length;
    
    // 4bytes 길이 헤더(접두사) 생성
    var lengthBytes = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 4);
    lengthBytes[0] = (length >>> 24) & 0xFF;
    lengthBytes[1] = (length >>> 16) & 0xFF;
    lengthBytes[2] = (length >>> 8) & 0xFF;
    lengthBytes[3] = length & 0xFF;

    this.outputStream.write(lengthBytes); // 헤더
    this.outputStream.write(dataBytes);   // 바디
    this.outputStream.flush();
};

// 비동기 Python 코드 실행 요청
PythonRequester.prototype.executeCodeAsync = function(code, timeoutMs, callback, errorCallback) {
    if (!this.isConnected()) {
        if (errorCallback) {
            errorCallback(new Error("Not connected to server. Call connect() first."));
        }
        return;
    }
    
    var requestId = ++this.requestIdCounter;
    var request = new RequestItem(requestId, code, timeoutMs, callback, errorCallback);
    
    try {
        this.requestQueue.put(request);
    } catch (e) {
        if (errorCallback) {
            errorCallback(new Error("Failed to queue request: " + e.message));
        }
    }
};

// 동기식 Python 코드 실행 요청 메서드 (기존 호환성 유지)
// PythonRequester.prototype.executeCode = function(code, timeoutMs) {
//     if (!this.isConnected()) {
//         throw new Error("Not connected to server. Call connect() first.");
//     }
    
//     var result = null;
//     var error = null;
//     var completed = false;
    
//     this.executeCodeAsync(code, timeoutMs, 
//         function(res) {
//             result = res;
//             completed = true;
//         },
//         function(err) {
//             error = err;
//             completed = true;
//         }
//     );
    
//     // 완료될 때까지 대기 (폴링)
//     while (!completed) {
//         java.lang.Thread.sleep(10);
//     }
    
//     if (error) {
//         throw error;
//     }
    
//     return result;
// };

// 연결 종료 메서드
PythonRequester.prototype.disconnect = function() {
    this.isProcessing = false;
    
    // 처리 스레드 인터럽트
    if (this.processingThread) {
        this.processingThread.interrupt();
        this.processingThread = null;
    }
    
    // 큐에 남은 요청들에 대해 에러 콜백 호출
    while (!this.requestQueue.isEmpty()) {
        try {
            var request = this.requestQueue.poll();
            if (request && request.errorCallback) {
                request.errorCallback(new Error("Connection closed"));
            }
        } catch (e) {
            // pass
        }
    }
    
    try {
        if (this.inputStream) {
            this.inputStream.close();
            this.inputStream = null;
        }
        if (this.outputStream) {
            this.outputStream.close();
            this.outputStream = null;
        }
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
        this.connected = false;
    } catch (e) {
        // 이미 닫힌 경우 무시
    }
};

// 재연결
PythonRequester.prototype.reconnect = function() {
    this.disconnect();
    return this.connect();
};

// 테스트
PythonRequester.prototype.ping = function() {
    return this.executeCode("print('pong')", 5000);
};

// 큐들
PythonRequester.prototype.getQueueSize = function() {
    return this.requestQueue.size();
};
PythonRequester.prototype.clearQueue = function() {
    while (!this.requestQueue.isEmpty()) {
        try {
            var request = this.requestQueue.poll();
            if (request && request.errorCallback) {
                request.errorCallback(new Error("Request cancelled"));
            }
        } catch (e) {
            // pass
        }
    }
};



module.exports = {
    PythonRequester: PythonRequester,
    RequestItem: RequestItem
}
})()
