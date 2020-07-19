function UTF8Buffer(string) {
  // 求出每个字符的码点
  let codePointList = Array.from(string).map(c => c.charCodeAt());

  let UTF8BufferArray = [];
  
  codePointList.map((code, charIndex) => {
    // 一字节
    if (0x0000 <= code && code <= 0x007F ) {
      // 0xxxxxxx
      // 7bit
      let bit7Code = code.toString(2).padLeft(7, '0');
      UTF8BufferArray.push(parseBin2Byte('0' + bit7Code));
    }
    // 两字节
    else if (0x0080 <= code && code <= 0x07FF) {
      // 110xxxxx 10xxxxxx
      // 5 + 6 = 11bit
      let bit11Code = code.toString(2).padLeft(11, '0');
      UTF8BufferArray.push(parseBin2Byte('110' + bit11Code.substr(0, 5)));
      UTF8BufferArray.push(parseBin2Byte('10' + bit11Code.substr(5, 6)));
    }
    // 三字节
    else if (0x0800 <= code && code <= 0xFFFF) {
      // 1110xxxx 10xxxxxx 10xxxxxx
      // 4 + 6 + 6 = 16bit
      let bit16code = code.toString(2).padLeft(16, '0');
      UTF8BufferArray.push(parseBin2Byte('1110' + bit16code.substr(0, 4)));
      UTF8BufferArray.push(parseBin2Byte('10' + bit16code.substr(3, 6)));
      UTF8BufferArray.push(parseBin2Byte('10' + bit16code.substr(9, 6)));
    }
    // 四字节
    else if (0x010000 <= code && code <= 0x10FFFF) {
      // 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
      // 3 + 6 + 6 + 6 = 21bit
      let bit21code = code.toString(2).padLeft(21, '0');
      UTF8BufferArray.push(parseBin2Byte('11110' + bit21code.substr(0, 3)));
      UTF8BufferArray.push(parseBin2Byte('10' + bit21code.substr(3, 6)));
      UTF8BufferArray.push(parseBin2Byte('10' + bit21code.substr(9, 6)));
      UTF8BufferArray.push(parseBin2Byte('10' + bit21code.substr(15, 6)));
    }
    // 非法
    else {
      throw new Error('字符串“' + string + '”的第' + (charIndex + 1) + '位字符“' + string.charAt(charIndex) + '”，超出UTF-8的定义编码字符界限，转换失败！');
    }
  });
  
  return UTF8BufferArray;
}

// 左补齐
String.prototype.padLeft = function(total, pad) {
  return (Array(total).join(pad || 0) + this).slice(-total);
}

// 转换2进制为字节数据
function parseBin2Byte(binaryCode) {
  return Number.parseInt(binaryCode, 2).toString(16);
}

/**
 * 参考：
 * https://en.wikipedia.org/wiki/UTF-8
 * https://en.wikipedia.org/wiki/Data_buffer
 * https://www.jb51.net/article/109523.htm
 * 
 * 疑问：UTF-8最多可以是6字节？？？
 * https://blog.csdn.net/xiao297328/article/details/78725830
 */