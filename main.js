//main.js
const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');

// 라우터 불러오기
const indexRouter = require('./router/rootRouter');

// 정적 파일 제공 설정
// 가장 일반적인 경로를 마지막에 설정
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use('/img', express.static(path.join(__dirname, 'public/img')));
app.use(express.static(path.join(__dirname, 'public'))); // 마지막에 위치

// 뷰 엔진 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// 라우터 연결
app.use('/', indexRouter);

// 404 에러 처리
app.use((req, res, next) => {
  res.status(404).send('페이지를 찾을 수 없습니다.');
});

// 서버 실행
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
