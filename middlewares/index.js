const jwt = require('jsonwebtoken');

// 사용자가 로그인한 상태인지 확인하는 미들웨어
exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) { // 사용자가 인증된 상태인지 확인
        // passport -> res객체에 isAuthenticated 매서드 추가
        // 로그인 중이면 req.isAuthenticated() 가 True, 그렇지 않으면 False
        next(); // 인증된 상태이면 다음 미들웨어로 이동
    } else {
        res.status(403).send('로그인 필요'); 
        // 인증되지 않은 상태이면 403 상태 코드랑 함께 '로그인 필요' 메시지 전송
    }
};

// 사용자가 로그인하지 않은 상태인지 확인하는 미들웨어
exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) { // 사용자가 인증되지 않은 상태인지 확인
        next(); // 인증되지 않은 상태이면 다음 미들웨어
    } else { 
        const message = encodeURIComponent('로그인한 상태입니다.'); // 인증된 상태이면 메시지 인코딩
        res.redirect(`/?error=${message}`) // 메시지를 포함하여 리다이렉트
    }
};

//JWT 토큰 검증하는 미들웨어
exports.verifyToken = (req, res, next) => {
    try {
        // Authorization 헤더의 토큰을 검증하여 decoded 객체를 생성하고 이를 res.locals에 저장
        // 요청 헤더에 저장된 토큰(res.headers.authorization) 사용 -> 사용자가 쿠키처럼 헤더에 토큰을 넣어 전송
        // jwt.verify 메서드 -> 토큰 검증, 첫번째 인수(토큰), 두번째 인수(토큰의 비밀 키)
        res.locals.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        return next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            // 에러 이름이 'TokenExpiredError'이면 -> 올바른 토큰이지만, 유효기간 만료
            return res.status(419).json({
                code: 419,
                message: '토큰이 만료되었습니다.',
            });
        }
        return res.status(401).json({
            code: 401,
            message: '유호하지 않은 토큰입니다.'
        });
    }
};