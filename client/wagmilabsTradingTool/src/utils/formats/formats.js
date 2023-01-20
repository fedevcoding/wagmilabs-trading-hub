


const formatAddress = address => {
    return address && address.substring(0, 6) + "..." + address.substring(38)
}

const formatContractAddress = address => {
    return address.substring(0, 6) + "..." + address.substring(35)
}

const formatAddress2 = (address, userAddress) => {
    if(address.toLowerCase() === userAddress.toLowerCase()){
        return "you"
    }
    else{
        return address.substring(2, 8).toUpperCase()
    }
}

const roundPrice = (price) => {
    return Math.round(price * 100000) / 100000
}

const roundPrice2 = (price) => {
    return Math.round(price * 1000) / 1000
}

const getFiatPrice = (cryptoValue, fiatPrice) => {
    return (Math.round(cryptoValue * fiatPrice * 100) / 100) || 0
}

const formatIpfs = (link) => {
    const splitted = link.split("/")
    const cid = splitted[2]
    const suffix = splitted[3]
    const image = `https://ipfs.io/ipfs/${cid}/${suffix}`
    return image
}

const dateFormat1 = (timestamp) => {
    // example: Nov 13, 2022
    timestamp = parseInt(timestamp + "000")
    const formattedDate = new Date(timestamp).toLocaleDateString('en-us', {year:"numeric", month:"short", day:"numeric"}) 
    return formattedDate
}


const formatTime = (date) => {
    if (typeof date !== 'object') {
        date = new Date(date);
    }
    
    var seconds = Math.floor((new Date() - date) / 1000);
    var intervalType;
    
    var interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
        intervalType = 'year';
    } else {
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) {
        intervalType = 'month';
        } else {
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) {
            intervalType = 'day';
        } else {
            interval = Math.floor(seconds / 3600);
            if (interval >= 1) {
            intervalType = "hour";
            } else {
            interval = Math.floor(seconds / 60);
            if (interval >= 1) {
                intervalType = "minute";
            } else {
                interval = seconds;
                intervalType = "second";
            }
            }
        }
        }
    }
    
    if (interval > 1 || interval === 0) {
        intervalType += 's';
    }
    
    return interval + ' ' + intervalType + " ago";
}

module.exports = {
    formatAddress,
    formatContractAddress,
    formatAddress2,
    roundPrice,
    roundPrice2,
    dateFormat1,
    getFiatPrice,
    formatIpfs,
    formatTime
}