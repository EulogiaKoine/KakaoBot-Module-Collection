/** 
 * @description entity 관련 상수 모음
 * @updated 2023-12-13 23:20
 */

exports.DEFAULT_MAX_HP = 100  // 기본 HP(or 내구도)
exports.DEFAULT_MOB_MAX_HP = 100  // 기본 몹 HP

exports.exp_formula = lv => Math.pow(lv, 2) + 100  // 레벨업 필요 경험치 식