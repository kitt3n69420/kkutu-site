window.tagDescriptions = {
    '공식': '끄투 원작자인 쪼리핑님이 직접 운영하는 서버입니다.',
    '끄투3': '끄투 2 기반의 프리서버와 전혀 다른 시스템을 가진 끄투 3입니다.',
    '24시간': '24시간 상시 운영되는 서버입니다.',
    '대형': '동시 접속자가 많은 대형 서버입니다.',
    '뜻추가': '단어의 뜻이 추가된 서버입니다. 십자말풀이도 플레이 가능합니다.',
    '우리말샘': '우리말샘 단어를 지원하는 서버입니다.',
    '언노운워드': '사전에 없는 단어만 사용하는 언노운 워드 규칙을 지원하는 서버입니다.',
    '정보': '끄투 관련 정보를 제공하는 사이트입니다.',
    '유틸리티': '끄투 플레이에 도움을 주는 도구입니다.',
    '검색': '단어 검색 기능을 제공하는 사이트입니다.',
    '끝말잇기': '끝말잇기 기반 게임입니다.',
    '온라인': '온라인 멀티플레이를 지원하는 게임입니다.',
    'P2P': '서버 없이 유저 간 직접 접속하여 플레이하는 게임입니다.',
    '리듬': '리듬 장르의 게임입니다.'
};

const serversData = [
    {
        name: '끄투 온라인', color: '#1ebb55', textColor: '#1a1a1a',
        instances: [
            {
                id: 'kkutu', tags: ['공식', '24시간'], url: '#', startYear: 2014, endYear: 2017, operator: '쪼리핑',
                description: '글자로 놀자, 끄투 온라인!\n\n모든 것이 시작된 쪼리핑님의 원조 끄투에요. 전성기 때는 몇천 명의 사람이 있었지만 운영의 어려움 등으로 끄투가 오픈소스화 되었고, 그래서 지금처럼 여러 프리 서버가 생겼답니다.',
                relatedLinks: [
                    { name: '샌드박스', url: 'https://cafe.naver.com/sdbx' },
                    { name: '공식 디스코드', url: 'https://discord.com/invite/daldalso-809809541385682964' },
                    { name: '개발자 블로그', url: 'https://m.blog.naver.com/PostList.naver?blogId=dosel1005&tab=1' }
                ]
            },
            {
                id: 'kkutuonline', color: '#F3D368', tags: ['공식', '끄투3', '24시간', '언노운워드'], url: 'https://kkutu.kr', startYear: 2025.5, endYear: null, operator: '쪼리핑',
                description: '글자로 놀자! 끄투 온라인\n\n원조 끄투 개발자, 쪼리핑님이 직접 개발하신 새로운 버전의 끄투 공식 서버에요. 이전 버전인 끄투 2와는 시스템적으로 많이 달라요.',
                relatedLinks: [
                    { name: '공식 라운지', url: 'https://game.naver.com/lounge/kkutu/home' },
                    { name: '공식 디스코드', url: 'https://discord.com/invite/daldalso-809809541385682964' },
                    { name: '공식 블로그', url: 'https://daldal.so/w/JJoriping/%EB%81%84%ED%88%AC' },
                    { name: '전적 검색 사이트', url: 'https://morae.me/' }
                ]
            }
        ]
    },
    {
        name: '끄투리오', color: '#55AA55', textColor: '#ffffff',
        instances: [
            {
                id: 'kkuturio_2017_1', tags: ['24시간'], url: '#', startYear: 2017, endYear: 2017.5, operator: '이진성',
                description: '이진성님이 2017년 2월 16일에 오픈한 초창기 끄투리오 서버에요.', relatedLinks: []
            },
            {
                id: 'kkuturio_2017_2', tags: ['24시간'], url: '#', startYear: 2017.5, endYear: 2017.5, operator: '호박파이',
                description: '호박파이님이 2017년 10월 16일에 오픈한 끄투리오 서버에요. 이후 끄투한국(호류 운영)과 합쳐졌어요.', relatedLinks: []
            },
            {
                id: 'kkuturio_2019', tags: ['24시간'], url: '#', startYear: 2019.5, endYear: 2021, operator: '호류',
                description: '호류님이 끄투한국을 끄투리오로 이름을 바꾸어 2019년 9월 8일에 오픈한 서버에요. 2021년 김도훈님의 끄투리오로 통합되었어요.', relatedLinks: []
            },
            {
                id: 'kkuturio_2021', tags: ['24시간'], url: '#', startYear: 2021, endYear: 2024, operator: '김도훈',
                description: '김도훈님이 2021년 4월 24일에 다양한 서버들(끄투닷넷, 프로젝트 끄투 등)을 통합하여 오픈한 끄투리오 서버에요.', relatedLinks: []
            },
            {
                id: 'kkutuiokdh', tags: ['대형', '24시간', '뜻추가', '우리말샘'], url: 'https://kkutu.io/', startYear: 2024, endYear: null, operator: '김도훈',
                description: '글자로 놀자! 끄투리오\n\n끄투코리아 다음으로 유명한 대형 서버에요. 몇십 명대 접속자를 유지하고 있으며, 꾸준히 여러 서버가 합쳐지면서 다양한 기능들과 단어들이 추가되었어요.',
                relatedLinks: [
                    { name: '공식 카페', url: 'https://cafe.naver.com/kkutuio' },
                    { name: '공식 디스코드', url: 'https://discord.com/invite/kkutuio-395143193114705920' },
                    { name: '단어사전', url: 'https://kkutu.io/wordsheet' },
                    { name: '리오위키', url: 'https://kkutu.wiki/w/%EB%8C%80%EB%AC%B8' }
                ]
            }
        ]
    },
    {
        name: '끄투코리아', color: '#e5456d', textColor: '#ffffff',
        instances: [
            {
                id: 'kkutukorea', tags: ['대형', '24시간', '뜻추가'], url: 'https://kkutu.co.kr', startYear: 2017, endYear: null,
                description: '기상천외한 끝말잇기를 웹게임으로! 끄투코리아\n\n끄투코리아는 명실상부 가장 유명한 끄투 프리서버에요. 항상 몇백 명대의 접속자를 유지하고 있고, 스트리머들이 끄투를 한다고 하면 거의 이곳을 찾을 만큼 인지도 1위 서버에요.',
                relatedLinks: [
                    { name: '공식 카페', url: 'https://cafe.naver.com/kkutukorea' },
                    { name: '공식 라운지', url: 'https://game.naver.com/lounge/KKuTu_Korea/home' },
                    { name: '공식 디스코드', url: 'https://discord.com/invite/JP8SNa7' },
                    { name: '끄코위키', url: 'https://kkukowiki.kr/w/%EB%8C%80%EB%AC%B8' },
                    { name: '단어 검색 사이트', url: 'https://kkutu.info/' },
                    { name: '끄코 유틸리티', url: 'https://kkuko-utils.vercel.app/' }
                ]
            }
        ]
    },
    {
        name: '호박파이 끄투', color: '#ffb366', textColor: '#1a1a1a',
        instances: [
            { id: 'pumpkinpiekkutu', tags: [], url: '#', startYear: 2017, endYear: 2017.5, operator: '호박파이', description: '호박파이님이 2017년 2월 20일에 오픈한 서버로, 2017년 10월 16일 끄투리오에 통합되었어요.', relatedLinks: [] }
        ]
    },
    {
        name: '끄투한국', color: '#ff0000', textColor: '#ffffff',
        instances: [
            { id: 'kkutukorea_old1', tags: ['24시간'], url: '#', startYear: 2017, endYear: 2018, operator: '호류', description: '호류님이 2017년 2월 19일에 오픈한 서버에요. 이 서버는 같은 해 11월, 다른 버전의 끄투한국으로 이어졌어요.', relatedLinks: [] },
            { id: 'kkutukorea_old2', tags: ['24시간'], url: '#', startYear: 2018, endYear: 2019.5, operator: '호류', description: '호류님이 이전의 끄투한국과 호박파이 끄투리오를 통합하여 2017년 11월 17일에 오픈한 서버에요. 이후 2019년 9월 8일 끄투리오로 이름이 다시 변경되었어요.', relatedLinks: [] }
        ]
    },
    {
        name: '프로젝트 끄투', color: '#9933ff', textColor: '#ffffff',
        instances: [
            { id: 'projectkkutu', tags: ['언노운워드'], url: '#', startYear: 2017.5, endYear: 2021.5, operator: '코코냐', description: '코코냐님이 2017년 8월에 오픈한 서버로, 2021년 4월 24일 끄투리오에 통합되었어요. 언노운워드가 처음 만들어진 서버에요.', relatedLinks: [] }
        ]
    },
    {
        name: '끄투닷넷', color: '#3366cc', textColor: '#1a1a1a',
        instances: [
            {
                id: 'kkutudotnet_2017', name: '끄투닷넷 (2017)', tags: [], url: '#', startYear: 2017.9, endYear: 2019,
                description: '2017년 11월에 오픈한 끄투닷넷 서버에요. 해티 온라인에서 명칭을 변경한 것이며, 이후 알파끄투로 통합되었어요.', relatedLinks: []
            },
            {
                id: 'kkutudotnet_2020', textColor: '#ffffff', tags: [], url: '#', startYear: 2020, endYear: 2021.5, operator: '김도훈',
                description: '내 작은 글자 놀이터, 끄투닷넷!\n\n김도훈님이 2020년에 오픈한 끄투닷넷 서버에요. 알파끄투, 가루끄투, 모리끄투가 이곳으로 합쳐졌으며 이후 2021년 마지막으로 끄투리오에 통합되었어요.', relatedLinks: []
            }
        ]
    },
    {
        name: 'BF끄투', color: '#008cdc', textColor: '#ffffff',
        instances: [
            {
                id: 'bfkkutuold', tags: ['24시간'], url: '#', startYear: 2018, endYear: 2024,
                description: '새로운 끄투의 시작\n\n매우 다양한 기능을 가지고 있었고, 상당히 인원이 많았던 프리서버였어요. 클랜 시스템 및 내부 대회도 자주 있었어요.',
                relatedLinks: [{ name: '공식 디스코드', url: 'https://discord.com/invite/scPVHcE' }]
            },
            {
                id: 'bfkkutu', tags: ['24시간'], url: 'https://bfkkutu.kr/', startYear: 2024, endYear: null,
                description: '새로운 끄투의 시작\n\n매우 다양한 기능을 가지고 있었고, 전성기 때에는 상당히 인원이 많았던 프리서버였어요. 한국어 끄투 같은 특이한 모드도 있었죠. 하지만 안타깝게도 서버의 소스코드가 날아가면서 지금은 겨우 이름만 남은 상태에요. 현재의 BF끄투는 소스코드를 아예 새로 작성한 것이랍니다.',
                relatedLinks: [{ name: '공식 디스코드', url: 'https://discord.com/invite/scPVHcE' }]
            }
        ]
    },
    {
        name: '끄투클럽', color: '#ffff55', textColor: '#1a1a1a',
        instances: [
            { id: 'skykkutu_watts011', name: '스카이끄투', tags: [], url: '#', startYear: 2021.2, endYear: 2021.3, operator: 'watts011', description: 'watts011님이 2021년 3월부터 4월까지 운영하신 서버에요.', relatedLinks: [] },
            { id: 'kkutuclub_watts011', tags: [], url: '#', startYear: 2021.6, endYear: 2023.5, operator: 'watts011', description: 'watts011님이 스카이끄투에 이어 2021년 7월부터 2023년 6월경까지 운영하신 끄투클럽 서버에요.', relatedLinks: [] },
            { id: 'kkutube_watts011', name: '끄튜브', tags: [], url: '#', startYear: 2023.6, endYear: 2024.2, operator: 'watts011', description: 'watts011님이 끄투클럽에 이어 2023년 8월경부터 2024년 3월까지 운영하신 서버에요.', relatedLinks: [] },
            { id: 'kkutus_watts011', name: '끄투어스', tags: [], url: '#', startYear: 2026.5, endYear: null, operator: 'watts011', description: 'watts011님이 준비 중인 새로운 끄투 서버에요. 현재 오픈 준비 중입니다.', relatedLinks: [] },
        ]
    },
    {
        name: '해티 온라인', color: '#ff9999', textColor: '#1a1a1a',
        instances: [
            { id: 'hatyonline', tags: [], url: '#', startYear: 2017.5, endYear: 2017.9, description: '2017년 7월경 오픈한 서버로, 2017년 11월에 끄투닷넷으로 명칭을 변경했어요.', relatedLinks: [] }
        ]
    },
    {
        name: '라이트끄투', color: '#ffff99', textColor: '#1a1a1a',
        instances: [
            { id: 'lightkkutu', tags: [], url: '#', startYear: 2017.7, endYear: 2019, operator: '성호준', description: '성호준님이 개발 및 운영하셨으며, 2017년 9월에 오픈한 서버로, 2019년에 끄투닷넷과 함께 알파끄투로 통합되었어요.', relatedLinks: [] }
        ]
    },
    {
        name: '가루끄투', color: '#f0f0f0', textColor: '#1a1a1a',
        instances: [
            { id: 'garukkutu', tags: [], url: '#', startYear: 2018, endYear: 2020, operator: '씽이 외', description: '2018년에 오픈한 서버로, 다양한 주제가 있었던 서버에요. 이후 2020년 끄투닷넷으로 통합되었어요.', relatedLinks: [] }
        ]
    },
    {
        name: '모리끄투', color: '#ccffcc', textColor: '#1a1a1a',
        instances: [
            { id: 'morikkutu', tags: [], url: '#', startYear: 2018, endYear: 2020, operator: '볕뉘', description: '볕뉘님이 개발 및 운영하신 2018년에 오픈한 서버로, 끄투에 그림퀴즈 모드 PR을 올린 서버이기도 해요. 이후 2020년 끄투닷넷으로 통합되었어요.', relatedLinks: [] }
        ]
    },
    {
        name: '알파끄투', color: '#ffcc99', textColor: '#1a1a1a',
        instances: [
            { id: 'alphakkutu', tags: [], url: '#', startYear: 2019, endYear: 2020, description: '2019년에 라이트끄투와 끄투닷넷이 통합되어 만들어진 서버에요. 이후 2020년에 김도훈님이 운영하는 끄투닷넷으로 통합되었어요.', relatedLinks: [] }
        ]
    },
    {
        name: '마한끄투', color: '#3E4BD1', textColor: '#ffffff',
        instances: [
            { id: 'oldmahankkutu', tags: ['24시간'], url: '#', startYear: 2023, endYear: 2023.5, operator: '마한', description: '글자로 놀자! 마한끄투\n\n마한님이 운영하셨던 끄투 프리서버에요. 23년 상반기에 운영을 시작해서 같은 해 하반기에 운영을 종료했다가, 다시 24년부터 운영을 시작했어요.', relatedLinks: [{ name: '공식 카페', url: 'https://cafe.naver.com/mahankkutu' }, { name: '공식 디스코드', url: 'https://discord.com/invite/fs8f5eUZ' }] },
            { id: 'mahankkutu', tags: ['24시간', '언노운워드'], url: 'https://mahan.kr/', startYear: 2024, endYear: null, operator: '마한', description: '글자로 놀자! 마한끄투\n\n마한님이 운영 중인 끄투 프리서버에요. 언노운 워드 규칙으로 유명하고, 자유 모드, 모음퀴즈 모드같이 재밌는 모드가 많고 압도적인 양의 주제의 단어도 많이 추가되어 있어요.', relatedLinks: [{ name: '공식 카페', url: 'https://cafe.naver.com/mahankkutu' }, { name: '공식 디스코드', url: 'https://discord.com/invite/fs8f5eUZ' }] }
        ]
    },
    {
        name: '철팽끄투', color: '#593ed1', textColor: '#ffffff',
        instances: [
            { id: 'chulpaengkkutu', tags: [], url: '#', startYear: 2023.5, endYear: 2025.5, operator: '철팽', description: '교통으로 즐기는 철팽끄투!\n\n철팽끄투는 철팽님이 운영하셨던 끄투로, 교통 중심의 단어가 매우 많았어요. 현재는 마한끄투에 통합되었어요.', relatedLinks: [] }
        ]
    },
    {
        name: '개미끄투', color: '#8aff8a', textColor: '#1a1a1a',
        instances: [
            { id: 'antu', tags: ['24시간'], url: 'https://antu.kro.kr/', startYear: 2024, endYear: 2026, operator: '아이앤트', description: '글자로 놀자! 개미끄투\n\n아이앤트님이 운영하시는 끄투 프리서버였어요. 24시간 운영이었어요.', relatedLinks: [{ name: '개발자 블로그', url: 'https://blog.naver.com/vio08' }] }
        ]
    },
    {
        name: '레전드끄투', color: '#52E6F2', textColor: '#ffffff',
        instances: [
            { id: 'legendkkutu_old', tags: [], url: '#', startYear: 2021.6, endYear: 2022.5, operator: '정희정', description: '2021년 8월 10일에 최초로 오픈했던 초기 레전드끄투 서버에요.', relatedLinks: [] },
            { id: 'legendkkutu', tags: ['뜻추가', '언노운워드'], url: 'https://legendkkutu.kr/', startYear: 2026, endYear: null, operator: '정희정', description: '글자로 놀자! 레전드끄투\n\n오랫동안 자고 있다가 최근에 다시 운영을 시작한 서버에요. 다양한 단어와 게임모드, 규칙들이 계속 추가되고 있고, 업데이트 주기도 빠르답니다.', relatedLinks: [{ name: '개발자 유튜브', url: 'https://www.youtube.com/@%EC%A0%95%ED%9D%AC%EC%A0%95-p6o' }, { name: '단어장', url: 'https://legendkkutu.kr/wordsearch' }] }
        ]
    },
    {
        name: '끄투엔', color: '#5D9DF4', textColor: '#1a1a1a',
        instances: [
            { id: 'kkutun', tags: ['24시간', '뜻추가', '우리말샘', '언노운워드'], url: 'https://kkutu-n.xyz', startYear: 2025.5, endYear: null, description: '글자로 놀자! 끄투엔\n\n최근에 새로 생긴 끄투 프리서버에요. 30개나 되는 게임 모드와 거의 60개에 달하는 압도적인 양의 특수규칙이 있어요.', relatedLinks: [{ name: '공식 디스코드', url: 'https://discord.com/invite/aEAVmrtU4w' }] }
        ]
    },
    {
        name: 'DE LZB 끄투', color: '#ffdd8a', textColor: '#1a1a1a',
        instances: [
            { id: 'delzb', tags: ['24시간', '언노운워드'], url: 'https://delzb.app', startYear: 2026, endYear: null, operator: 'minjun1177', description: '글자로 놀자! DE LZB 끄투\n\nminjun1177님이 운영하시는 끄투 서버에요. 모스부호로 입력, 포네틱 입력 등 아마추어 무선 관련 규칙들이 있고, 24시간 운영되고 있어요.', relatedLinks: [{ name: '개발자 블로그', url: 'https://daldal.so/w/minjun/delzbkkutu' }] }
        ]
    },
    {
        name: '바로끄투 (구. 랜덤스튜디오 끄투)', color: '#507080', textColor: '#ffffff',
        instances: [
            { id: 'randomstudio', name: '랜덤스튜디오 끄투', tags: [], url: '#', startYear: 2021, endYear: 2022, operator: '제 2의 끄투', description: '제 2의 끄투님이 운영하셨던 서버로, 2021년경에 존재했어요. 이후 바로끄투로 이어졌어요.', relatedLinks: [] },
            { id: 'barokkutu', name: '바로끄투', tags: [], url: '#', startYear: 2022, endYear: 2025, operator: '제 2의 끄투', description: '"제 2의 끄투"라는 분이 운영하던 프리서버고, 2022년 후반기부터 2025년 초반까지 운영했던 프리 서버에요.', relatedLinks: [] },
            { id: 'barokkutunew', name: '바로끄투', tags: [], url: 'http://barokkutu.kro.kr/', startYear: 2026, endYear: null, operator: '제 2의 끄투', description: '"제 2의 끄투"라는 분이 운영하는 프리서버에요. 최근에 다시 문을 열었고, 일반 끄투와 디자인이 조금 달라요.', relatedLinks: [] }
        ]
    },
    {
        name: '분홍끄투', color: '#ffb6d9', textColor: '#1a1a1a',
        instances: [
            { id: 'pinkkkutu', tags: ['24시간', '언노운워드'], url: '#', startYear: 2020, endYear: 2024.5, operator: '분홍꽃', description: '오늘도 즐거운 분홍끄투!\n\n분홍꽃님이 2020년부터 2024년 4월 20일까지 운영하신 웹 게임 끄투 프리서버에요. DB가 굉장히 넓었으며 서비스 종료 전에는 한국어 자유 끝말잇기, 한국어 자유 등의 게임모드들이 인기가 많았어요. 최대 400명까지 수용 가능한 규모였답니다.', relatedLinks: [] }
        ]
    },
    {
        name: '행성끄투', color: '#5d3fd3', textColor: '#ffffff',
        instances: [
            { id: 'planetkkutu', tags: ['24시간'], url: '#', startYear: 2020, endYear: 2024.5, operator: 'yeokyoomin', description: 'yeokyoomin님이 2020년부터 2024년 5월경까지 운영했던 끄투 프리서버에요.', relatedLinks: [] }
        ]
    },
    {
        name: '끄투블루', color: '#0070c0', textColor: '#ffffff',
        instances: [
            {
                id: 'kkutublue', tags: ['24시간'], url: 'https://copy-bid-676628.framer.app/', startYear: 2020.5, endYear: 2023.5, operator: '문창영',
                description: '글자로 놀자! 끄투블루\n\n끄투블루는 2020년 8월 23일 서비스를 시작한 끄투 프리 서버에요. 게임물관리위원회에서 전체이용가 등급 판정을 받았던 정식 심의 서버이기도 하답니다. 2023년 6월 3일에 아쉽게도 서비스를 종료했어요. 지금은 메인페이지는 연결되지만 접속이 안돼요.',
                relatedLinks: [
                    { name: '공식 디스코드', url: 'https://discord.gg/Twnrnhf' },
                    { name: '개발자 유튜브', url: 'https://www.youtube.com/channel/UCz0G1bvJ_0PAkFl0uN50DkA' },
                ]
            }
        ]
    },
    {
        name: '트꾸', color: '#efff00', textColor: '#1a1a1a',
        instances: [
            { id: 'tukku', tags: [], url: '#', startYear: 2021, endYear: 2021.5, operator: '키뮤', description: '끄투에서 한 걸음 더 나아가면 트꾸!\n\n키뮤님이 만드신 끄투 프리서버로, 독특한 디자인과 컨텐츠, 다양한 단어가 있었던 서버에요. 2021년 전반기에 서버가 생겼지만 같은 해 10월부터 서비를 연 기록이 없어요..', relatedLinks: [] }
        ]
    },
    {
        name: '끄투닷사이트', color: '#7840e8', textColor: '#1a1a1a',
        instances: [
            { id: 'kkutusite', tags: [], url: '#', startYear: 2021.5, endYear: 2023.5, operator: 'lkke', description: '이 사이트도 원래 끄투 프리서버의 주소였다는 사실, 아시나요? lkke님이 운영하시던 끄투 서버였고, 리턴, 랜덤턴, 랜덤미션 등의 규칙이 있었답니다.', relatedLinks: [] }
        ]
    },
    {
        name: 'ZEP 끄투', color: '#5555ff', textColor: '#ffffff',
        instances: [
            { id: 'zepkkutu', tags: [], url: '#', startYear: 2023.5, endYear: 2024, description: 'ZEP오목(현 오목랜드)에서 이용할 수 있던 끄투 서버에요. 2023년 여름에서 2024년까지 서비스했어요.', relatedLinks: [] }
        ]
    },
    {
        name: '끄투닷컴', color: '#ff5555', textColor: '#ffffff',
        instances: [
            { id: 'kkutucom', tags: ['24시간'], url: '#', startYear: 2017, endYear: 2021.5, operator: 'SkyLightHQ', description: 'SkyLightHQ님이 운영했던 끄투 프리서버에요. 2017년 3월부터 2021년 4월 10일까지 서비스했어요.', relatedLinks: [{ name: '공식 디스코드', url: 'https://discord.gg/gDgWvGM' }] }
        ]
    },
    {
        name: '도토리끄투', color: '#55ff55', textColor: '#1a1a1a',
        instances: [
            { id: 'dokku', tags: ['24시간'], url: '#', startYear: 2020.5, endYear: 2021, operator: '도토리', description: '도토리님이 2020년부터 운영하신 끄투 서버에요. 도토리 디자인을 사용해서 디자인이 원조 끄투와 상당히 다르며, 원신이나 블루 아카이브 같은 게임 관련 주제의 단어가 매우 많았던 것이 특징이에요.', relatedLinks: [] },
            { id: 'kkutudotplus', name: '끄투닷플러스', tags: [], url: '#', startYear: 2021, endYear: 2024, operator: '도토리', description: '글자에 즐거움을 더하다, 끄투닷플러스\n\n도토리님이 도토리끄투에 이어 2021년부터 2024년까지 운영하신 사이트에요. \'도토리 디자인\'이 확립된 끄투 서버기도 해요.', relatedLinks: [] }
        ]
    },
    {
        name: '월드끄투', color: '#aaaaaa', textColor: '#1a1a1a',
        instances: [
            { id: 'worldkkutu', tags: [], url: '#', startYear: 2024, endYear: 2025, operator: '고구마', description: '세상의 끄투, 월드끄투!\n\n고구마님이 운영하신 끄투 프리서버에요. 2024년 3월 19일부터 2025년 1월 20일까지 운영되었어요.', relatedLinks: [{ name: '공식 카페', url: 'https://cafe.naver.com/wordkkutu' }, { name: '공식 디스코드', url: 'https://discord.com/invite/QZcZQacTnv' }] }
        ]
    },
    {
        name: '플러스끄투', color: '#600bb4', textColor: '#ffffff',
        instances: [
            { id: 'pluskkutu', tags: ['24시간'], url: '#', startYear: 2023.5, endYear: 2025.5, operator: '모렘미', description: '모든 것이 플러스, 플러스끄투!\n\n모렘미님이 운영하신 끄투 프리서버에요. 2023년 11월경 오픈 베타를 거쳐 2024년 2월 23일에 정식 출시되었어요. 다른 끄투와 전혀 다른, 세련된 UI와 시스템을 가지고 있었으며, 2025년 5월 6일에 서비스 종료되어 끄투리오와 통합되었어요.', relatedLinks: [] }
        ]
    },
    {
        name: '북유럽끄투', color: '#A2D2FF', textColor: '#1a1a1a',
        instances: [
            { id: 'nekkutu', tags: [], url: '#', startYear: 2024, endYear: 2024.5, operator: 'AHE', description: 'AHE님이 운영하셨던 끄투 프리서버에요. 2023년 12월 30일에 오픈했었으며 2024년 7월 1일에 서비스를 종료했어요.', relatedLinks: [] }
        ]
    },

    {
        name: '쯔투온라인', color: '#e4c99aff', textColor: '#1a1a1a',
        instances: [
            { id: 'jjutuonline', tags: [], url: '#', startYear: 2017.5, endYear: 2018, description: '마치 약을 거하게 빤 듯한 서버였어요. 2017년 후반에 서비스가 종료되었어요.', relatedLinks: [] }
        ]
    },
    {
        name: '카투', color: '#4891ff', textColor: '#ffffff',
        instances: [
            { id: 'kkatu', tags: [], url: '#', startYear: 2017, endYear: 2017.5, operator: 'dalca', description: 'dalca님이 개발 및 운영했던 서버로, 2017년 전반에 서비스가 종료되었어요.', relatedLinks: [] }
        ]
    },
    {
        name: '비트유끄투', color: '#ffb3ba', textColor: '#1a1a1a',
        instances: [
            { id: 'bitukkutu', tags: [], url: '#', startYear: 2017.5, endYear: 2020, operator: 'Minesna', description: 'Minesna님이 개발 및 운영했던 서버로, 2017년 후반에 오픈해서 2020년 전반까지 운영되었어요.', relatedLinks: [] }
        ]
    },
    {
        name: 'KT on IIDX', color: '#baffc9', textColor: '#1a1a1a',
        instances: [
            { id: 'ktoniidx', tags: [], url: '#', startYear: 2017, endYear: 2017.5, operator: 'geonu', description: 'geonu님이 운영하셨던 서버로, 2017년 3월 7일에 서비스가 종료되었어요. 다른 서버와는 다른 고퀄리티의 사운드를 가지고 있었어요.', relatedLinks: [] }
        ]
    },
    {
        name: '멘트온라인', color: '#bae1ff', textColor: '#1a1a1a',
        instances: [
            { id: 'mentonline', tags: [], url: '#', startYear: 2017.5, endYear: 2018.5, description: '2017년 6월 15일에 오픈한 프리서버에요.', relatedLinks: [] }
        ]
    },
    {
        name: '투데이끄투', color: '#ffffaa', textColor: '#1a1a1a',
        instances: [
            { id: 'todaykkutu', tags: [], url: '#', startYear: 2018, endYear: 2020, operator: '무언가', description: '무언가님이 운영했던 서버에요. 레벨업이 빡센 대신 경험치를 많이 줬었어요.', relatedLinks: [] }
        ]
    },
    {
        name: '이름없는끄투', color: '#00ffff', textColor: '#1a1a1a',
        instances: [
            { id: 'namelesskkutu', tags: [], url: '#', startYear: 2017.5, endYear: 2020, operator: '정현수', description: '정현수님이 운영했던 서버에요.', relatedLinks: [] }
        ]
    },
];

window.servers = [];
serversData.forEach(group => {
    group.instances.forEach(inst => {
        window.servers.push({
            name: inst.name || group.name,
            color: inst.color || group.color,
            textColor: inst.textColor || group.textColor,
            ...inst,
            tags: inst.tags || []
        });
    });
});

window.utilities = [
    {
        name: '끄투 프리서버 목록',
        url: 'https://free.kkutu.kr',
        startYear: 2017,
        endYear: null,
        description: '쪼리핑님이 제작하신 프리서버 목록이에요. 끄투 3의 출시로 인해 2024년 이후로 업데이트가 멈췄어요.',
        tags: ['정보'],
        color: '#2641A3'
    },
    {
        name: '끝말잇기 엔진',
        url: 'https://engine.ikki.app/?rule=%EA%B5%AC%EC%97%9C%EB%A3%B0',
        startYear: 2025,
        endYear: null,
        description: '단어들을 분석해서 끝말잇기에 어떤 단어가 유리한지를 알려주는 유용한 사이트에요.',
        tags: ['유틸리티', '검색'],
        color: '#0DA2E7'
    },
    {
        name: '끄투박물관',
        url: 'https://free.kkutu.kr/museum',
        startYear: 2017,
        endYear: null,
        description: '끄투 2의 역사를 볼 수 있는 박물관이에요.',
        tags: ['정보'],
        color: '#00AF92'
    }
];

window.recommendedGames = [
    {
        name: '이끼',
        url: 'https://ikki.app',
        startYear: 2025.5,
        endYear: null,
        description: '1대 1에 특화된 끝말잇기 게임이에요. 구엜룰, 넶룰 등 지원하는 룰이 많고, 끝말잇기 엔진도 여기서 서비스해요.',
        tags: ['끝말잇기', '온라인'],
        color: '#4be693'
    },
    {
        name: '마이워드',
        url: 'https://myword.store/',
        startYear: 2025.5,
        endYear: null,
        description: '피딮님이 2025년에 개발하신 끝말잇기 게임이에요. 토스 쿵쿵따를 기반으로 만들어졌어요.',
        tags: ['끝말잇기', '온라인'],
        color: '#a2b4a2'
    },
    {
        name: '토스 쿵쿵따',
        url: 'https://discord.com/invite/UFnmw3U',
        startYear: 2015,
        endYear: null,
        description: '캔디바 쿵쿵따를 모티브로 제작된 끝말잇기 게임이에요. P2P 방식이라서 하마치 등으로 직접 연결해야 해요.',
        tags: ['끝말잇기', 'P2P'],
        color: '#ba60fa'
    },
    {
        name: '파워 쿵쿵따',
        url: 'https://game2.netmarble.net/kkoongda/',
        startYear: 2007,
        endYear: null,
        description: '넷마블에서 2002년부터 서비스 중인 장수 쿵쿵따 게임이에요. 공포의 쿵쿵따 룰을 기반으로 만들어졌어요.',
        tags: ['끝말잇기', '온라인'],
        color: '#4ad6e5'
    },
    {
        name: '자바!',
        url: 'https://sorry.daldal.so/java',
        startYear: 2021,
        endYear: null,
        description: '노래의 가사에 맞춰서 키보드를 누르는 리듬 게임이에요.',
        tags: ['리듬', '온라인'],
        color: '#3175DC'
    }
];

window.announcement = {
    message: '아직 타임머신 기능엔 부족한 부분이 많아요. 잘못되거나 빠진 정보가 있다면 제보해주세요!',
    link: 'https://discord.gg/zn2xC57Ftz', // 링크가 필요한 경우. 필요 없으면 빈 문자열('')
    visible: true
};
