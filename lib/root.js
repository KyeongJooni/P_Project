const db = require('./carddb');
const { queryDatabase } = require('./carddb');
const path = require('path'); // Node.js 기본 모듈

module.exports = {
    home: async (req, res) => {
        try {
            // 각 섹션별로 4개의 카드만 가져오기
            const twentyCards = await queryDatabase('SELECT * FROM twenty_credit ORDER BY card_id LIMIT 4');
            const govCards = await queryDatabase('SELECT * FROM gov_Credit ORDER BY card_id LIMIT 4');
            const personalCards = await queryDatabase('SELECT * FROM personal_Card ORDER BY card_id LIMIT 4');
            const eventCards = await queryDatabase('SELECT * FROM event_Card ORDER BY card_id LIMIT 4');

            const context = {
                body: 'home',
                path: '/',
                twentyCards,
                govCards,
                personalCards,
                eventCards
            };
            res.render('mainFrame', context);
        } catch (err) {
            console.error('카드 데이터 조회 오류:', err);
            res.status(500).send('데이터 조회 중 오류가 발생했습니다.');
        }
    },

    twenty: async (req, res) => {
        try {
            console.log('카드 데이터 조회 시작');
            const rows = await queryDatabase('SELECT * FROM twenty_credit ORDER BY card_id');
            console.log('조회된 카드 수:', rows.length);
            console.log('조회된 카드 데이터:', rows);

            const context = {
                body: 'twenty',
                cards: rows,
                path: '/twenty'
            };
            res.render('mainFrame', context);
        } catch (err) {
            console.error('카드 데이터 조회 오류:', err);
            res.status(500).send('데이터 조회 중 오류가 발생했습니다.');
        }
    },

    twentyCheck: async (req, res) => {
        try {
            const rows = await queryDatabase('SELECT * FROM twenty_Check ORDER BY card_id');
            const context = {
                body: 'twenty',
                cards: rows,
                path: '/twenty' // 체크카드 데이터 전달
            };
            res.render('mainFrame', context);
        } catch (err) {
            console.error('체크카드 데이터 조회 오류:', err);
            res.status(500).send('데이터 조회 중 오류가 발생했습니다.');
        }
    },

    personal: async (req, res) => {
        try {
            const rows = await queryDatabase('SELECT * FROM personal_Card');
            const context = {
                body: 'personal',
                cards: rows, // 카드 데이터 전달
                path: '/personal'
            };
            res.render('mainFrame', context);
        } catch (err) {
            console.error('카드 데이터 조회 오류:', err);
            res.status(500).send('데이터 조회 중 오류가 발생했습니다.');
        }
    },

    personalFilter: async (req, res) => {
        const keyword = req.query.keyword || ''; // URL에서 키워드 가져오기
        if (!keyword) {
            return res.status(400).send('검색어가 없습니다.');
        }

        try {
            // benefit 컬럼에서 키워드 포함 검색
            const rows = await queryDatabase(
                'SELECT * FROM personal_Card WHERE benefit LIKE ?',
                [`%${keyword}%`]
            );

            const context = {
                body: 'personal',
                cards: rows, // 필터링된 카드 데이터 전달
                path: path
            };
            res.render('mainFrame', context);
        } catch (err) {
            console.error('카드 필터링 오류:', err);
            res.status(500).send('데이터 조회 중 오류가 발생했습니다.');
        }
    },

    gov: async (req, res) => {
        try {
            const rows = await queryDatabase('SELECT * FROM gov_Credit');
            const context = {
                body: 'gov',
                cards: rows, // 카드 데이터 전달
                path: '/gov'
            };
            res.render('mainFrame', context);
        } catch (err) {
            console.error('카드 데이터 조회 오류:', err);
            res.status(500).send('데이터 조회 중 오류가 발생했습니다.');
        }
    },

    govCheck: async (req, res) => {
        try {
            const rows = await queryDatabase('SELECT * FROM gov_Check');
            const context = {
                body: 'gov',
                cards: rows, // 카드 데이터 전달
                path: '/gov'
            };
            res.render('mainFrame', context);
        } catch (err) {
            console.error('카드 데이터 조회 오류:', err);
            res.status(500).send('데이터 조회 중 오류가 발생했습니다.');
        }
    },

    event: async (req, res) => {
        try {
            const rows = await queryDatabase('SELECT * FROM event_Card');
            const context = {
                body: 'event',
                cards: rows, // 카드 데이터 전달
                path: '/event'
            };
            res.render('mainFrame', context);
        } catch (err) {
            console.error('카드 데이터 조회 오류:', err);
            res.status(500).send('데이터 조회 중 오류가 발생했습니다.');
        }
    },

    search_twenty: async (req, res) => {
        try {
            const searchKeyword = req.body.search || '';
            console.log('검색어:', searchKeyword);

            if (!searchKeyword.trim()) {
                return root.twenty(req, res);
            }

            const sql = `
                SELECT * FROM twenty_Credit 
                WHERE card_name LIKE ? 
                OR annual_fee LIKE ? 
                OR monthly_spending_requirement LIKE ?
                OR benefit LIKE ?
                UNION
                SELECT * FROM twenty_Check 
                WHERE card_name LIKE ? 
                OR annual_fee LIKE ? 
                OR monthly_spending_requirement LIKE ?
                OR benefit LIKE ?
            `;

            const likeKeyword = `%${searchKeyword}%`;
            // 8개의 매개변수 전달 (UNION으로 인해 각 테이블당 4개씩)
            const params = [
                likeKeyword, likeKeyword, likeKeyword, likeKeyword,  // twenty_credit 테이블용
                likeKeyword, likeKeyword, likeKeyword, likeKeyword   // twenty_check 테이블용
            ];

            const results = await queryDatabase(sql, params);

            const context = {
                body: 'twenty',
                path: '/twenty',
                searchResults: results,
                searchKeyword: searchKeyword,
                cards: results  // 검색 결과를 cards로도 전달
            };

            res.render('mainFrame', context);

        } catch (err) {
            console.error('검색 오류:', err);
            // 에러 발생 시에도 페이지를 렌더링
            const context = {
                body: 'twenty',
                path: '/twenty',
                searchKeyword: req.body.search || '',  // searchKeyword를 req.body.search로 수정
                error: '검색 중 오류가 발생했습니다.',
                cards: []  // 빈 배열 전달
            };
            res.render('mainFrame', context);
        }
    },

    search_gov: async (req, res) => {
        try {
            const searchKeyword = req.body.search || '';
            console.log('검색어:', searchKeyword);

            if (!searchKeyword.trim()) {
                return root.twenty(req, res);
            }

            const sql = `
                SELECT * FROM gov_Credit
                WHERE card_name LIKE ? 
                OR annual_fee LIKE ? 
                OR monthly_spending_requirement LIKE ?
                OR benefit LIKE ?
                UNION
                SELECT * FROM gov_Check
                WHERE card_name LIKE ? 
                OR annual_fee LIKE ? 
                OR monthly_spending_requirement LIKE ?
                OR benefit LIKE ?
            `;

            const likeKeyword = `%${searchKeyword}%`;
            // 8개의 매개변수 전달 (UNION으로 인해 각 테이블당 4개씩)
            const params = [
                likeKeyword, likeKeyword, likeKeyword, likeKeyword,  // twenty_credit 테이블용
                likeKeyword, likeKeyword, likeKeyword, likeKeyword   // twenty_check 테이블용
            ];

            const results = await queryDatabase(sql, params);

            const context = {
                body: 'gov',
                path: '/gov',
                searchResults: results,
                searchKeyword: searchKeyword,
                cards: results  // 검색 결과를 cards로도 전달
            };

            res.render('mainFrame', context);

        } catch (err) {
            console.error('검색 오류:', err);
            // 에러 발생 시에도 페이지를 렌더링
            const context = {
                body: 'gov',
                path: '/gov',
                searchKeyword: req.body.search || '',  // searchKeyword를 req.body.search로 수정
                error: '검색 중 오류가 발생했습니다.',
                cards: []  // 빈 배열 전달
            };
            res.render('mainFrame', context);
        }
    },

    search_event: async (req, res) => {
        try {
            const searchKeyword = req.body.search || '';
            console.log('검색어:', searchKeyword);

            if (!searchKeyword.trim()) {
                return root.twenty(req, res);
            }

            const sql = `
                SELECT * FROM event_Card
                WHERE card_name LIKE ? 
                OR annual_fee LIKE ? 
                OR monthly_spending_requirement LIKE ?
                OR benefit LIKE ?
                UNION
                SELECT * FROM event_Card
                WHERE card_name LIKE ? 
                OR annual_fee LIKE ? 
                OR monthly_spending_requirement LIKE ?
                OR benefit LIKE ?
            `;

            const likeKeyword = `%${searchKeyword}%`;
            // 8개의 매개변수 전달 (UNION으로 인해 각 테이블당 4개씩)
            const params = [
                likeKeyword, likeKeyword, likeKeyword, likeKeyword,  // twenty_credit 테이블용
                likeKeyword, likeKeyword, likeKeyword, likeKeyword   // twenty_check 테이블용
            ];

            const results = await queryDatabase(sql, params);

            const context = {
                body: 'event',
                path: '/event',
                searchResults: results,
                searchKeyword: searchKeyword,
                cards: results  // 검색 결과를 cards로도 전달
            };

            res.render('mainFrame', context);

        } catch (err) {
            console.error('검색 오류:', err);
            // 에러 발생 시에도 페이지를 렌더링
            const context = {
                body: 'event',
                path: '/event',
                searchKeyword: req.body.search || '',  // searchKeyword를 req.body.search로 수정
                error: '검색 중 오류가 발생했습니다.',
                cards: []  // 빈 배열 전달
            };
            res.render('mainFrame', context);
        }
    }
};