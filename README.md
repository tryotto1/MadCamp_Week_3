Code with Me
==============
# 개요

몰입캠프 3주차 과제 - Teachable machine을 이용한 집중도 측정 및 순위 비교 웹 제작

# 조원

[김상윤](https://github.com/tryotto1)

[이현호](https://github.com/dot0ris)

# 설명

## 전체 구조

- 노트북의 웹캠이나 스마트폰의 카메라를 이용하여 사용자의 화면을 얻어옵니다.

- 구글의 Teachable machine로 사용자의 모션(코딩 중, 잠자는 중, 핸드폰 하는 중, 자리비움 등)을 classification하는 모델을 만들고, 위의 카메라로 가져온 이미지를 분류합니다.

- 실제 집중한 시간을 서버 DB에 저장하며, 친구들과 집중한 시간을 비교할 수 있습니다.

## 1. 메인화면
(FIXME: 메인화면 이미지)

- 심플한 구조의 메인화면입니다. 랭킹 확인, 회원가입, 로그인, 녹화 시작 등의 기능을 할 수 있습니다.

## 2. 회원가입/로그인
(FIXME: 회원가입 이미지)

- 간단한 회원가입/로그인 화면입니다. 사용자 이메일, 패스워드, 목표(ex) 100시간!)을 적을 수 있습니다.

- POST 방식으로 서버에 보내지며, 서버 내부의 MongoDB에 저장됩니다. 비밀번호는 암호화되어 저장됩니다.

- 로그인 성공시, 사이트 쿠키에 사용자 이메일을 저장합니다. 이는 아래 집중도 측정 및 랭킹 페이지를 표시하는데 사용됩니다.

## 3. 집중도 측정
(FIXME: 웹캠 있는 이미지)

- 카메라를 통해 본인의 현재 모습을 확인할 수 있으며, 우측 도표로 본인이 얼마나 집중했는지를 확인할 수 있습니다.

- 시작 버튼을 누르면 이미지 녹화가 시작되며, 제출 버튼을 통해 녹화를 끝내고 서버에 집중한 시간을 보낼 수 있습니다.

## 4. 랭킹
(FIXME: 랭킹 이미지)

- 로그인한 사용자 친구들의 랭킹과 전체 랭킹을 확인할 수 있습니다.

- 금일 집중한 시간과 금주 집중한 시간 2가지를 확인할 수 있습니다.

- 각 분야 별로 상위 5명을 확인할 수 있습니다.
