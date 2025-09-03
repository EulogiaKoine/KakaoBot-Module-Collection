# 로그인에 필요한 정보
ID = "elruien0604@gmail.com"
PW = "veto0604^^"

############### 코드 ################

from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
import time
import random

driver = webdriver.Chrome()
driver.get('https://instagram.com')
driver.implicitly_wait(15)
print('로그인 진행중...')

inputbox = driver.find_element(By.XPATH, '//input[@aria-label="전화번호, 사용자 이름 또는 이메일"]')
inputbox.click()
inputbox.send_keys(ID)

inputbox = driver.find_element(By.XPATH, '//input[@aria-label="비밀번호"]')
inputbox.click()
inputbox.send_keys(PW)

inputbox.send_keys(Keys.ENTER)
time.sleep(4)
driver.get("https://www.instagram.com/nail_3111/followers")
time.sleep(4)
followers = driver.find_element(By.CSS_SELECTOR, '#mount_0_0_l9 > div > div > div.x9f619.x1n2onr6.x1ja2u2z > div > div > div.x78zum5.xdt5ytf.x1t2pt76.x1n2onr6.x1ja2u2z.x10cihs4 > div.x9f619.xvbhtw8.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1uhb9sk.x1plvlek.xryxfnj.x1c4vz4f.x2lah0s.x1q0g3np.xqjyukv.x1qjc9v5.x1oa3qoh.x1qughib > div.x1gryazu.xh8yej3.x10o80wk.x14k21rp.x17snn68.x6osk4m.x1porb0y > div:nth-child(2) > section > main > div > header > section > ul > li:nth-child(2) > a')
time.sleep(8)
followers.click()
time.sleep(120)