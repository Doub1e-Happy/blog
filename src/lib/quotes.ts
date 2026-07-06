/**
 * @file 每日格言数据
 * 根据日期 hash 每天自动切换一条格言
 */

export interface Quote {
  text: string;
  author: string;
}

export const QUOTES: Quote[] = [
  { text: "代码是写给人看的，附带能在机器上运行。", author: "Harold Abelson" },
  { text: "先让它能工作，再让它更好，最后让它更快。", author: "Kent Beck" },
  { text: "简洁是可靠的先决条件。", author: "Edsger W. Dijkstra" },
  { text: "任何足够先进的技术，都与魔法无异。", author: "Arthur C. Clarke" },
  { text: "最好的错误消息是永远不会出现的那个。", author: "Thomas Fuchs" },
  { text: "谈论是廉价的，给我看代码。", author: "Linus Torvalds" },
  { text: "程序必须为人而写，只是附带让机器执行。", author: "SICP" },
  { text: "好的设计是尽可能少的设计。", author: "Dieter Rams" },
  { text: "做一件事情，并把它做好。", author: "Unix 哲学" },
  { text: "过早优化是万恶之源。", author: "Donald Knuth" },
  { text: "简单的事情应该简单，复杂的事情应该可能。", author: "Alan Kay" },
  { text: "我们不是因为变老而停止玩耍，而是因为停止玩耍才变老。", author: "Benjamin Franklin" },
  { text: "如果你无法简单地解释它，说明你还没有充分理解它。", author: "Albert Einstein" },
  { text: "唯一犯错的方式是什么都不做。", author: "Seymour Papert" },
  { text: "迭代是通向卓越的路径，反复打磨，直到精致。", author: "Paul Graham" },
  { text: "真正的发现之旅不在于寻找新大陆，而在于用新的眼光看世界。", author: "Marcel Proust" },
  { text: "安全不是一种产品，而是一个过程。", author: "Bruce Schneier" },
  { text: "所有模型都是错的，但有些是有用的。", author: "George E.P. Box" },
  { text: "站在巨人的肩膀上，不是因为自己不够高，而是因为能看到更远。", author: "Isaac Newton" },
  { text: "世界上最危险的短语是：我们一直都是这么做的。", author: "Grace Hopper" },
  { text: "今天你写下的每一行代码，都是明天的技术债或资产。", author: "Ward Cunningham" },
  { text: "黑客精神的核心不是破坏，而是无尽的好奇与创造。", author: "Richard Stallman" },
  { text: "最强大的武器是一个会思考的大脑。", author: "Alan Turing" },
  { text: "不要重复你自己。每一项知识都应该在系统中拥有单一、明确的表示。", author: "Andy Hunt" },
  { text: "编程不是关于你知道什么，而是关于你能弄清楚什么。", author: "Chris Pine" },
  { text: "最好的时间栽一棵树是二十年前，其次是现在。", author: "中国谚语" },
  { text: "数据是新的石油，但精炼才是关键。", author: "Clive Humby" },
  { text: "没有什么比一个错误的想法更危险的了，尤其当它恰好有效时。", author: "Bertrand Russell" },
  { text: "如果 debug 是消除 bug 的过程，那编程就是引入 bug 的过程。", author: "Edsger Dijkstra" },
  { text: "写代码就像写作文，好的代码读起来就像好的散文。", author: "Robert C. Martin" },
];

/**
 * 根据日期获取今日格言，确保同一天返回同一条
 */
export function getDailyQuote(): Quote {
  const now = new Date();
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return QUOTES[dayOfYear % QUOTES.length];
}
