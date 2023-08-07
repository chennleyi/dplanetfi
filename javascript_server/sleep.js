/** 睡眠阻塞函数 */
function sleep(ms) {
  const start = new Date().getTime();
  while (new Date().getTime() - start < ms);
}

module.exports = {sleep};

