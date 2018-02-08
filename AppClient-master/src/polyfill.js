// Object.values is only defined on Chrome 54+, Firefox 47+, and Safari 10.1+
Object.values = obj => Object.keys(obj).map(key => obj[key]);
