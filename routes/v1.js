const express = require('express');

const { verifyToken } = require('../middlewares');
const { createToken, tokenTest } = require('../controllers/v1');

const router = express.Router();

// POST /v1/token 경로로 요청이 들어왔을 때 createToken 함수 실행
// 토큰을 발금하는 라우터
router.post('/token', createToken);

// GET /v1/test 경로로 요청이 들어왔을 떄 verifyToken 미들웨어를 거친 후 tokenTest 함수 실행
// 사용자가 발급받은 토큰을 테스트해볼 수 있는 라우터
router.get('/test', verifyToken, tokenTest);

module.exports = router; // 모듈을 외부에서 사용할 수 있도록 내보냄