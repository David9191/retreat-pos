/**
 * 숫자에 천 단위 구분 쉼표를 추가하는 함수
 * @param {number} num - 포맷팅할 숫자
 * @returns {string} 포맷팅된 문자열
 */
export const formatNumber = num => {
  if (num === null || num === undefined) return '0';

  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * 한국어 통화 형식으로 포맷팅하는 함수
 * @param {number} num - 포맷팅할 숫자
 * @returns {string} 포맷팅된 문자열 (예: 1,234원)
 */
export const formatCurrency = num => {
  return `${formatNumber(num)}원`;
};
