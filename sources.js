const regions = {
    "US": "USCA",
    "CA": "USCA",
    "GB": "EU",
    "AU": "AP",
    "DE": "EU",
    "FR": "EU",
    "JP": "AP",
    "ES": "EU",
    "BR": "W",
    "default": "W"
};

const regionFactors = {
    "USCA": 5,
    "EU": 1.7,
    "AP": 0.47,
    "W": 0.38,
};

const deviceFactors = {
    "USCA":{"iPhone" : 0.81, "Android": 1.24},
    "EU":{"iPhone" : 0.98, "Android": 1.15},
    "AP":{"iPhone" : 1.18, "Android": 0.99},
    "W":{"iPhone" : 1.13, "Android": 0.97},
};

const genderFactors = {
    "female": 1.2,
    "male": 0.85,
    "not-specified": 1.0
};

const usageFactors = {
    "reels": 1.0,
    "mi": 1.1,
    "si": 0.9
};

const sources = [
    {
        name: "Statista: Instagram's Global Ad Revenue",
        url: "https://www.statista.com/statistics/253758/instagrams-annual-revenue/"
    },
    {
        name: "Business of Apps: Instagram Revenue and Usage Statistics",
        url: "https://www.businessofapps.com/data/instagram-statistics/"
    },
    {
        name: "Hootsuite: Social Media Ad Spend Statistics",
        url: "https://blog.hootsuite.com/social-media-advertising-stats/"
    }
];
