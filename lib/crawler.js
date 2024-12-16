const puppeteer = require('puppeteer');
const { saveToDatabase } = require('./carddb');
const fs = require('fs');
const path = require('path');
const os = require('os');

// 임시 파일 삭제 함수
function deletePuppeteerTemp() {
    const tempDir = os.tmpdir();
    const files = fs.readdirSync(tempDir);
    
    files.forEach(file => {
        if (file.startsWith('puppeteer_dev_chrome_profile-')) {
            const filePath = path.join(tempDir, file);
            try {
                fs.rmSync(filePath, { recursive: true, force: true });
                console.log(`삭제됨: ${filePath}`);
            } catch (err) {
                console.error(`삭제 실패: ${filePath}`, err);
            }
        }
    });
}

//상세보기 URL
const detailUrls = [
    'https://www.ibk.co.kr/cardbiz/detailBizNew.ibk?pageId=CA01020000&PDLN_CD=12&PDGR_CD=11&PDTM_CD=281&PDCD=0001&ad_cd=cardgopc&mz_cd=ICARDGO',
    'https://cardapplication.ibk.co.kr/card/index.jsp?card_prdc_id=103214',
    'https://www.samsungcard.com/home/card/cardinfo/PGHPPCCCardCardinfoDetails001?code=AAP1753',
    'https://card-search.naver.com/item?cardAdId=10328',
    'https://www.shinhancard.com/pconts/html/card/apply/credit/1188274_2207.html?EntryLoc2=2871&empSeq=785&btnApp=DP1W',
    'https://www.shinhancard.com/pconts/html/card/apply/credit/1187945_2207.html',
    'https://www.shinhancard.com/pconts/html/card/apply/credit/1219175_2207.html',
    'https://m.kbcard.com/CRD/DVIEW/MCAMCXHIACRC0002?mainCC=b&allianceCode=09061',
    'https://www.bccard.com/app/card/CreditCardMain.do?gdsno=755847',
    'https://card-search.naver.com/item?cardAdId=10313',
    'https://www.lottecard.co.kr/app/LPCDXAA_V020.lc',
    'https://img.hyundaicard.com/cpc/cr/CPCCR0201_01.hc?cardWcd=MSSHC',
    'https://www.shinhancard.com/pconts/html/card/apply/credit/1188280_2207.html',
    'https://card-search.naver.com/item?cardAdId=10314',
    'https://www.lotteon.com/display/planV2/planDetail/104185',
    'https://www.shinhancard.com/pconts/html/card/apply/credit/1198302_2207.html',
    'https://www.shinhancard.com/pconts/html/card/apply/credit/1187938_2207.html',
    'https://card-search.naver.com/item?cardAdId=10160',
    'https://www.shinhancard.com/pconts/html/card/apply/check/1225544_2206.html',
    'https://m.kbcard.com/CRD/DVIEW/MCAMCXHIACRC0002?mainCC=b&allianceCode=09231',
    'https://www.samsungcard.com/home/card/cardinfo/PGHPPCCCardCardinfoDetails001?code=AAP1762&click=idcard_showroom_move',
    'https://m.kbcard.com/CRD/DVIEW/MCAMCXHIACRC0002?mainCC=b&allianceCode=09174',
    'https://jiwon3.lottecard.co.kr/app/LPCDADB_V100.lc?vtCdKndC=P13943-A13943',
    'https://cardapplication.ibk.co.kr/card/index.jsp?card_prdc_id=100914&branch=crmlms',
    'https://cardapplication.ibk.co.kr/card/index.jsp?card_prdc_id=927222&ad_cd=bc&mz_cd=ETCBCCA',
    'https://www.shinhancard.com/pconts/html/card/apply/credit/1187924_2207.html',
    'https://www.banksalad.com/product/cards/CARD000019',
    'https://card.kbcard.com/CRD/DVIEW/HCAMCXPRICAC0076?categoryCode=L0093&cooperationcode=01998&mainCC=a&sGroupCode=2',
    'https://m.kbcard.com/CRD/DVIEW/MCAMCXHIACRC0002?allianceCode=01690&mainCC=b',
    'https://m.kbcard.com/CRD/DVIEW/MCAMCXHIACRC0002?mainCC=b&allianceCode=07960',
    'https://m.kbcard.com/CRD/DVIEW/MCAMCXHIACRC0002?allianceCode=01918&mainCC=b',
    'https://www.shinhancard.com/pconts/html/card/apply/check/1188362_2206.html',
    'https://m.kbcard.com/CRD/DVIEW/MCAMCXHIACRC0002?mainCC=b&allianceCode=04120',
];

let urlIndex = 0;  // URL 인덱스 추적

// 데이터를 추출하는 함수
async function extractCardData(page, url) {
    try {
        console.log(`URL 이동: ${url}`);
        
        // 페이지 이동 전에 이전 페이지의 리소스 정리
        await page.evaluate(() => window.stop());
        
        // 페이지 이동 시도 (최대 3번)
        let attempts = 2;
        while (attempts > 0) {
            try {
                await page.goto(url, { 
                    waitUntil: 'networkidle0',
                    timeout: 30000 
                });
                break;
            } catch (error) {
                attempts--;
                if (attempts === 0) throw error;
                await new Promise(r => setTimeout(r, 2000));
            }
        }
        
        // 페이지가 완전히 로드될 때까지 추가 대기
        await page.waitForSelector('#q-app');
        await new Promise(r => setTimeout(r, 2000));

        // 데이터 추출
        let cardName;
        try {
            // 첫 번째 선택자로 시도
            cardName = await page.$eval(
                '#q-app > section > div.card_detail.fr-view > section > div > article.card_top > div > div > div.data_area.multi > div.tit > strong',
                el => el.innerText.trim()
            );
        } catch (error) {
            try {
                // 첫 번째 실패 시 두 번째 선택자로 시도
                cardName = await page.$eval(
                    '#q-app > section > div.card_detail.fr-view > section > div > article.card_top > div > div > div.data_area > div.tit > strong',
                    el => el.innerText.trim()
                );
            } catch (error) {
                cardName = '미정'; // 모든 선택자가 실패한 경우 기본값
            }
        }
        const annualFee = await page.$eval(
            '.card_detail .bnf2 dl dd.in_out',
            el => el.innerText.trim()
        );
        const monthly_spending_requirement = await page.$eval(
            '#q-app > section > div.card_detail.fr-view > section > div > article.card_top > div > div > div.bnf2 > dl:nth-child(2)',
            el => el.innerText.trim()
        );
        const cardType = '신용카드'; // 고정 값

        // 혜택 정보 추출
        const benefit = await page.$$eval(
            '#q-app > section > div.card_detail.fr-view > section > div > article.cmd_con.benefit > div.lst.bene_area > dl > dt > i',
            elements => elements.map(el => el.innerText.trim()).slice(0, 6)
        );

        // 이미지 URL 크롤링
        let imageUrl;
        try {
            imageUrl = await page.$eval(
                '#q-app > section > div.card_detail.fr-view > section > div > article.card_top > div > div > div.plate_area > div > div > div.q-carousel__slides-container > div > div > img',
                el => el.src
            );
        } catch (error) {
            try {
                imageUrl = await page.$eval(
                    '#q-app > section > div.card_detail.fr-view > section > div > article.card_top > div > div > div.plate_area > div > img',
                    el => el.src
                );
            } catch (error) {
                imageUrl = '없음'; // 모든 선택자가 실패한 경우 기본값
            }
        }

        const detailUrl = detailUrls[urlIndex];
        urlIndex = (urlIndex + 1) % detailUrls.length;

        return {
            card_name: cardName || '미정',
            annual_fee: annualFee || '없음',
            monthly_spending_requirement: monthly_spending_requirement || '없음',
            card_type: cardType,
            benefit: benefit || [],
            image_url: imageUrl || '없음',
            detail_url: detailUrl
        };
    } catch (error) {
        console.error(`데이터 추출 실패 (URL: ${url}):`, error.message);
        return null;
    }
}

// 데이터 저장 로직
async function saveCardData(cardData) {
    try {
        // 혜택 데이터를 쉼표로 구분된 문자열로 변환
        cardData.benefit = cardData.benefit.join('; ');

        // 데이터 저장
        await saveToDatabase(cardData);
        console.log(`데이터 저장 성공: ${cardData.card_name}`);
    } catch (error) {
        console.error('데이터 저장 중 오류 발생:', error.message);
    }
}

// 크롤링 메인 함수
(async () => {
    try {
        deletePuppeteerTemp();
        console.log('크롤링 시작...');
        const browser = await puppeteer.launch({
            userDataDir: undefined,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        urlIndex = 0;

        // 크롤링할 URL 목록
        const urls = [
            'https://www.card-gorilla.com/card/detail/258', // Oil & Life 카드 (주유)
            'https://www.card-gorilla.com/card/detail/2610', // 그린카드
            'https://www.card-gorilla.com/card/detail/2290' ,// iD ENERGY 카드
            'https://www.card-gorilla.com/card/detail/2661' ,// plug-in 카드
            'https://www.card-gorilla.com/card/detail/39' ,// Deep Oil
            'https://www.card-gorilla.com/card/detail/16', // RPM+ 카드
            'https://www.card-gorilla.com/card/detail/2467', // 신한 알뜰모아 (통신)
            'https://www.card-gorilla.com/card/detail/106', // 굿데이카드
            'https://www.card-gorilla.com/card/detail/264', // IBK olleh super 
            'https://www.card-gorilla.com/card/detail/2649', // 농협 zgm
            'https://www.card-gorilla.com/card/detail/2633', // 디지로카 paris (쇼핑)
            'https://www.card-gorilla.com/card/detail/733', // 무신사 현대카드
            'https://www.card-gorilla.com/card/detail/41', // Deep On platinum
            'https://www.card-gorilla.com/card/detail/2648', // zgm shopping
            'https://www.card-gorilla.com/card/detail/2444', // 롯데마트 MAAX
            'https://www.card-gorilla.com/card/detail/687', // 신한 Unboxing
            'https://www.card-gorilla.com/card/detail/10', // 신한 B.big (대중교통)
            'https://www.card-gorilla.com/card/detail/2408', // NH 홈타운
            'https://www.card-gorilla.com/card/detail/2690', // K-패스
            'https://www.card-gorilla.com/card/detail/142', // 톡톡 pay
            'https://www.card-gorilla.com/card/detail/2364', // id Move
            'https://www.card-gorilla.com/card/detail/129', // 청춘대로 톡톡카드 (카페)
            'https://www.card-gorilla.com/card/detail/2262', // LOCA likit
            'https://www.card-gorilla.com/card/detail/723', // 무민카드
            'https://www.card-gorilla.com/card/detail/266', // 일상의 기쁨
            'https://www.card-gorilla.com/card/detail/14', // YOLO
            'https://www.card-gorilla.com/card/detail/2070', // 뱅크샐러드 빨대
            'https://www.card-gorilla.com/card/detail/454', // 가온 올포인트 (주유)
            'https://www.card-gorilla.com/card/detail/350', // 직장인보너스 체크카드
            'https://www.card-gorilla.com/card/detail/2604', // 토심이 첵첵 (교통)
            'https://www.card-gorilla.com/card/detail/614', // 위글위글
            'https://www.card-gorilla.com/card/detail/294', // 신한 S-line
            'https://www.card-gorilla.com/card/detail/739', // 나라사랑 국민 (위에꺼로 다 가능)
        ];

        for (const url of urls) {
            const cardData = await extractCardData(page, url);

            if (cardData) {
                console.log('크롤링된 데이터:', cardData);
                await saveCardData(cardData);
            } else {
                console.log('데이터 추출 실패, 건너뜀.');
            }
        }

        await browser.close();
        console.log('브라우저 닫힘. 크롤링 종료.');
    } catch (error) {
        console.error('크롤링 전체 오류 발생:', error.message);
    }
})();