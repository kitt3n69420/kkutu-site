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

window.servers = [
    {
        id: 'kkutuonline',
        name: '끄투 온라인',
        tags: ['공식', '끄투3', '24시간'],
        color: '#F3D368',
        textColor: '#1a1a1a',
        url: 'https://kkutu.kr',
        description: '글자로 놀자! 끄투 온라인\n\n원조 끄투 개발자, 쪼리핑님이 직접 개발하신 새로운 버전의 끄투 공식 서버에요. 이전 버전인 끄투 2와는 시스템적으로 많이 달라요.',
        relatedLinks: [
            { name: '공식 라운지', url: 'https://game.naver.com/lounge/kkutu/home' },
            { name: '공식 디스코드', url: 'https://discord.com/invite/daldalso-809809541385682964' },
            { name: '공식 블로그', url: 'https://daldal.so/w/JJoriping/%EB%81%84%ED%88%AC' },
            { name: '전적 검색 사이트', url: 'https://morae.me/' }
        ]
    },
    {
        id: 'kkutukorea',
        name: '끄투코리아',
        tags: ['대형', '24시간', '뜻추가'],
        color: '#e5456d',
        textColor: '#ffffff',
        url: 'https://kkutu.co.kr',
        description: '기상천외한 끝말잇기를 웹게임으로! 끄투코리아\n\n끄투코리아는 명실상부 가장 유명한 끄투 프리서버에요. 항상 몇백 명대의 접속자를 유지하고 있고, 스트리머들이 끄투를 한다고 하면 거의 이곳을 찾을 만큼 인지도 1위 서버에요.',
        relatedLinks: [
            { name: '공식 카페', url: 'https://cafe.naver.com/kkutukorea' },
            { name: '공식 라운지', url: 'https://game.naver.com/lounge/KKuTu_Korea/home' },
            { name: '공식 디스코드', url: 'https://discord.com/invite/JP8SNa7' },
            { name: '끄코위키', url: 'https://kkukowiki.kr/w/%EB%8C%80%EB%AC%B8' },
            { name: '단어 검색 사이트', url: 'https://kkutu.info/' },
            { name: '끄코 유틸리티', url: 'https://kkuko-utils.vercel.app/' }
        ]
    },
    {
        id: 'kkutuio',
        name: '끄투리오',
        tags: ['대형', '24시간', '뜻추가', '우리말샘'],
        color: '#55AA55',
        textColor: '#ffffff',
        url: 'https://kkutu.io/',
        description: '글자로 놀자! 끄투리오\n\n끄투코리아 다음으로 유명한 대형 서버에요. 몇십 명대 접속자를 유지하고 있으며, 꾸준히 여러 서버가 합쳐지면서 다양한 기능들과 단어들이 추가되었어요.',
        relatedLinks: [
            { name: '공식 카페', url: 'https://cafe.naver.com/kkutuio' },
            { name: '공식 디스코드', url: 'https://discord.com/invite/kkutuio-395143193114705920' },
            { name: '단어사전', url: 'https://kkutu.io/wordsheet' },
            { name: '리오위키', url: 'https://kkutu.wiki/w/%EB%8C%80%EB%AC%B8' }
        ]
    },
    {
        id: 'bfkkutu',
        name: 'BF끄투',
        tags: ['24시간'],
        color: '#008cdc',
        textColor: '#ffffff',
        url: 'https://bfkkutu.kr/',
        description: '새로운 끄투의 시작\n\n매우 다양한 기능을 가지고 있었고, 전성기 때에는 상당히 인원이 많았던 프리서버였어요. 한국어 끄투 같은 특이한 모드도 있었죠. 하지만 안타깝게도 서버의 소스코드가 날아가면서 지금은 겨우 이름만 남은 상태에요. 현재의 BF끄투는 소스코드를 아예 새로 작성한 것이랍니다.',
        relatedLinks: [
            { name: '공식 디스코드', url: 'https://discord.com/invite/scPVHcE' },
        ]
    },
    {
        id: 'mahankkutu',
        name: '마한끄투',
        tags: ['24시간', '언노운워드'],
        color: '#3E4BD1',
        textColor: '#ffffff',
        url: 'https://mahan.kr/',
        description: '글자로 놀자! 마한끄투\n\n마한님이 운영 중인 끄투 프리서버에요. 언노운 워드 규칙으로 유명하고, 자유 모드, 모음퀴즈 모드같이 재밌는 모드가 많고 압도적인 양의 주제의 단어도 많이 추가되어 있어요.',
        relatedLinks: [
            { name: '공식 카페', url: 'https://cafe.naver.com/mahankkutu' },
            { name: '공식 디스코드', url: 'https://discord.com/invite/fs8f5eUZ' },
        ]
    },
    {
        id: 'antu',
        name: '개미끄투',
        tags: ['24시간'],
        color: '#8aff8a',
        textColor: '#1a1a1a',
        url: 'https://antu.kro.kr/',
        description: '글자로 놀자! 개미끄투\n\n아이앤트님이 운영하시는 끄투 프리서버에요. 24시간 운영되고 있어요.',
        relatedLinks: [
            { name: '개발자 블로그', url: 'https://blog.naver.com/vio08' },
        ]
    },
    {
        id: 'legendkkutu',
        name: '레전드끄투',
        tags: ['뜻추가', '언노운워드'],
        color: '#52E6F2',
        textColor: '#ffffff',
        url: 'https://legendkkutu.kr/',
        description: '글자로 놀자! 레전드끄투\n\n오랫동안 자고 있다가 최근에 다시 운영을 시작한 서버에요. 다양한 단어와 게임모드, 규칙들이 계속 추가되고 있고, 업데이트 주기도 빠르답니다.',
        relatedLinks: [
            { name: '개발자 유튜브', url: 'https://www.youtube.com/@%EC%A0%95%ED%9D%AC%EC%A0%95-p6o' },
            { name: '단어장', url: 'https://legendkkutu.kr/wordsearch' },
        ]``
    },
    {
        id: 'kkutun',
        name: '끄투엔',
        tags: ['24시간', '뜻추가', '우리말샘', '언노운워드'],
        color: '#5D9DF4',
        textColor: '#1a1a1a',
        url: 'https://kkutu-n.xyz',
        description: '글자로 놀자! 끄투엔\n\n최근에 새로 생긴 끄투 프리서버에요. 30개나 되는 게임 모드와 거의 60개에 달하는 압도적인 양의 특수규칙이 있어요.',
        relatedLinks: [
            { name: '공식 디스코드', url: 'https://discord.com/invite/aEAVmrtU4w' },
        ]
    },
];

window.utilities = [
    {
        name: '끄투 프리서버 목록',
        url: 'https://free.kkutu.kr',
        description: '쪼리핑님이 제작하신 프리서버 목록이에요. 끄투 3의 출시로 인해 2024년 이후로 업데이트가 멈췄어요.',
        tags: ['정보'],
        color: '#2641A3'
    },
    {
        name: '끄글',
        url: 'https://engine.ikki.app/?rule=%EA%B5%AC%EC%97%9C%EB%A3%B0',
        description: '단어들을 분석해서 끝말잇기에 어떤 단어가 유리한지를 알려주는 유용한 사이트에요.',
        tags: ['유틸리티', '검색'],
        color: '#0DA2E7'
    },
    {
        name: '끄투박물관',
        url: 'https://free.kkutu.kr/museum',
        description: '끄투 2의 역사를 볼 수 있는 박물관이에요.',
        tags: ['정보'],
        color: '#00AF92'
    }
];

window.recommendedGames = [
    {
        name: '마이워드',
        url: 'https://myword.store/',
        description: '피딮님이 2025년에 개발하신 끝말잇기 게임이에요. 토스 쿵쿵따를 기반으로 만들어졌어요.',
        tags: ['끝말잇기', '온라인'],
        color: '#a2b4a2'
    },
    {
        name: '토스 쿵쿵따',
        url: 'https://discord.com/invite/UFnmw3U',
        description: '캔디바 쿵쿵따를 모티브로 제작된 끝말잇기 게임이에요. P2P 방식이라서 하마치 등으로 직접 연결해야 해요.',
        tags: ['끝말잇기', 'P2P'],
        color: '#ba60fa'
    },
    {
        name: '파워 쿵쿵따',
        url: 'https://game2.netmarble.net/kkoongda/',
        description: '넷마블에서 2002년부터 서비스 중인 장수 쿵쿵따 게임이에요.',
        tags: ['끝말잇기', '온라인'],
        color: '#4ad6e5'
    },
    {
        name: '자바!',
        url: 'https://sorry.daldal.so/java',
        description: '노래의 가사에 맞춰서 키보드를 누르는 리듬 게임이에요.',
        tags: ['리듬', '온라인'],
        color: '#3175DC'
    }
];
