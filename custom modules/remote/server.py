import socket
import json
import struct
import time
import threading
import sys
from io import StringIO

HOST = '127.0.0.1'
PORT = 65432
BUF_SIZE = 4096

# 전역 스코프를 유지하기 위한 딕셔너리
execution_globals = {}

class TimeoutError(Exception):
    pass

class CodeExecutor:
    def __init__(self):
        self.result = None
        self.exception = None
        self.output = ""
        self.error = ""
        self.completed = False
        
    def execute_code(self, code):
        """별도 스레드에서 코드를 실행하는 메서드"""
        global execution_globals
        
        try:
            # 표준 출력/에러 캡처
            old_stdout = sys.stdout
            old_stderr = sys.stderr
            old_stdin = sys.stdin
            
            # input() 함수 차단
            class BlockedInput:
                def readline(self):
                    raise RuntimeError("Input operations are not allowed")
                def read(self, size=-1):
                    raise RuntimeError("Input operations are not allowed")
            
            sys.stdout = StringIO()
            sys.stderr = StringIO()
            sys.stdin = BlockedInput()
            
            # 코드 실행
            exec(code, execution_globals)
            
            # 출력 캡처
            self.output = sys.stdout.getvalue()
            self.error = sys.stderr.getvalue()
            
        except Exception as e:
            self.exception = e
            if hasattr(sys.stderr, 'getvalue'):
                self.error = sys.stderr.getvalue()
        finally:
            # 표준 스트림 복원
            try:
                sys.stdout = old_stdout
                sys.stderr = old_stderr
                sys.stdin = old_stdin
            except:
                pass
            self.completed = True

def execute_py_with_timeout_and_scope(code, timeout=30):
    """
    스코프를 유지하면서 timeout이 보장되는 Python 코드 실행
    """
    output = ""
    error = ""
    
    # 정밀한 시간 측정 시작
    start_time = time.perf_counter()
    
    try:
        # CodeExecutor 인스턴스 생성
        executor = CodeExecutor()
        
        # 별도 스레드에서 코드 실행
        thread = threading.Thread(target=executor.execute_code, args=(code,))
        thread.daemon = True  # 메인 프로세스 종료 시 함께 종료
        thread.start()
        
        # timeout 시간만큼 대기
        thread.join(timeout)
        
        if thread.is_alive():
            # 타임아웃 발생
            error = f"Code execution timed out after {timeout} seconds"
            # 스레드는 daemon이므로 자동으로 정리됨
        elif executor.exception:
            # 실행 중 예외 발생
            if "Input operations are not allowed" in str(executor.exception):
                error = "Input operations (like input()) are not allowed"
            else:
                error = str(executor.exception)
        else:
            # 정상 실행 완료
            output = executor.output
            error = executor.error
            
    except Exception as e:
        error = f"Executor error: {str(e)}"
    
    # 정밀한 시간 측정 종료
    end_time = time.perf_counter()
    execution_time_ms = (end_time - start_time) * 1000
    
    return output, error, execution_time_ms

def receiveMessageLen(connection):
    res = b""
    while len(res) < 4:
        chunk = connection.recv(4 - len(res))
        if not chunk:
            print("Client disconnected during length prefix reception.")
            break
        res += chunk
    return res

def receiveRawData(connection, goal):
    data = b""
    while len(data) < goal:
        chunk = connection.recv(min(BUF_SIZE, goal - len(data)))
        if not chunk:
            print("Client disconnected during data reception.")
            break
        data += chunk
    return data

def send_response(connection, response_data):
    """안전한 응답 전송"""
    try:
        json_res_encoded = json.dumps(response_data, ensure_ascii=False).encode('utf-8')
        length_prefix = struct.pack('>I', len(json_res_encoded))
        connection.sendall(length_prefix + json_res_encoded)
        return True
    except (BrokenPipeError, ConnectionResetError):
        print("Client disconnected during response send.")
        return False
    except Exception as e:
        print(f"Error sending response: {str(e)}")
        return False

# 스코프 초기화 함수 (필요시 사용)
def reset_execution_scope():
    """실행 스코프를 초기화하는 함수"""
    global execution_globals
    execution_globals.clear()
    # 기본 builtins 유지
    execution_globals['__builtins__'] = __builtins__

# 서버 시작 시 스코프 초기화
reset_execution_scope()

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    s.bind((HOST, PORT))
    s.listen()
    print(f"Server is now listening at {HOST}:{PORT}")
    print(f"Running on Python {sys.version}")
    print(f"Platform: {sys.platform}")

    while True:
        try:
            connection, address = s.accept()
            with connection:
                print(f"Connected to {address}")
                
                while True:
                    # 메시지 길이 수신
                    msg_length = receiveMessageLen(connection)
                    if len(msg_length) < 4:
                        break

                    msg_length = struct.unpack('>I', msg_length)[0]
                    print(f"> Expecting {msg_length} bytes for request from {address}.")

                    # 요청 데이터 수신
                    raw_data = receiveRawData(connection, msg_length)
                    if len(raw_data) < msg_length:
                        print(f"Incomplete data received!")
                        break

                    try:
                        # JSON 요청 파싱
                        request_str = raw_data.decode('utf-8')
                        request = json.loads(request_str)
                        
                        code = request.get('code', '')
                        timeout = request.get('timeout', 30)
                        
                        # 특수 명령어 처리
                        if code == '__RESET_SCOPE__':
                            reset_execution_scope()
                            response = {
                                "status": "success",
                                "output": "Execution scope has been reset",
                                "error": "",
                                "execution_time_ms": 0
                            }
                        elif not code:
                            response = {
                                "status": "error",
                                "output": "",
                                "error": "No code provided in request",
                                "execution_time_ms": 0
                            }
                        else:
                            print(f"Received code: {code[:200]}...")
                            
                            # 스코프 유지하면서 timeout 보장된 실행
                            output, error, exec_time = execute_py_with_timeout_and_scope(code, timeout)
                            
                            response = {
                                "status": "success" if not error else "execution_error",
                                "output": output,
                                "error": error,
                                "execution_time_ms": round(exec_time, 6),  # 마이크로초 단위까지 정밀하게
                            }

                    except json.JSONDecodeError:
                        response = {
                            "status": "request_error",
                            "output": "",
                            "error": "Invalid JSON in request",
                            "execution_time_ms": 0
                        }
                    except UnicodeDecodeError:
                        response = {
                            "status": "decoding_error",
                            "output": "",
                            "error": "Failed to decode received data. Ensure UTF-8 encoding.",
                            "execution_time_ms": 0
                        }
                    except Exception as e:
                        response = {
                            "status": "server_error",
                            "output": "",
                            "error": f"Unexpected server error: {str(e)}",
                            "execution_time_ms": 0
                        }

                    # 응답 전송
                    if not send_response(connection, response):
                        break
                    
                    print(f"Responded execution result to client (exec_time: {response.get('execution_time_ms', 0):.6f}ms)")

                print(f"Disconnected with {address}")
                
        except KeyboardInterrupt:
            print("\nServer shutting down...")
            break
        except Exception as e:
            print(f"Server error: {str(e)}")

print("Server exited")
