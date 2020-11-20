/**
 * 第一个是 acessToken ，它的过期时间 token 本身的过期时间比如半个小时，另外一个是 refreshToken 它的过期时间更长一点比如为1天。客户端登录后，将 accessToken和refreshToken 保存在本地，每次访问将 accessToken 传给服务端。服务端校验 accessToken 的有效性，如果过期的话，就将 refreshToken 传给服务端。如果有效，服务端就生成新的 accessToken 给客户端。否则，客户端就重新登录即可。该方案的不足是：1. 需要客户端来配合；2. 用户注销的时候需要同时保证两个 token 都无效；3. 重新请求获取 token 的过程中会有短暂 token 不可用的情况（可以通过在客户端设置定时器，当accessToken 快过期的时候，提前去通过 refreshToken 获取新的accessToken）。
 * 1. 使用localStorage存储两个token：accessToken 和 refreshToken
 * 2. 使用 refreshToken 去刷新 accessToken
 * 3. 设置一个唯一的定时器去刷新
 */

import globalData from '@/utils/data';
import { post } from '@/utils/request';
import { getLocal, removeLocal, saveLocal } from '@/utils/util';

const accessTokenLocalKey = 'localAccessToken';
const refreshTokenLocalKey = 'localRefreshToken';
const accessTokenRefreshDuration = 1 * 60 * 1000; //ms

let refreshTimer: number;

async function isLogined() {
  return !!globalData.accessToken;
}

function getToken() {
  return globalData.accessToken;
}

function setToken(accessToken: string, refreshToken?: string) {
  // console.log(`set AccessToken: ${accessToken}`);
  globalData.accessToken = accessToken;
  saveLocal(accessTokenLocalKey, accessToken);
  if (refreshToken) {
    // console.log(`set RefreshToken: ${refreshToken}`);
    saveLocal(refreshTokenLocalKey, refreshToken);
  }
  startRefreshTokenTimer();
}

async function refreshToken() {
  let currentRefreshToken = getLocal(refreshTokenLocalKey);
  if (!currentRefreshToken) return undefined;
  // console.log(`refresh AccessToken with RefreshToken: ${currentRefreshToken}`);
  const {
    data: { accessToken },
  } = await post(`auth/update`, { refreshToken: currentRefreshToken });
  setToken(accessToken);
  return accessToken;
}

function startRefreshTokenTimer() {
  refreshTimer && clearTimeout(refreshTimer);
  refreshTimer = window.setTimeout(() => {
    refreshToken();
  }, accessTokenRefreshDuration);
}

function destroyTokens() {
  globalData.accessToken = '';
  removeLocal(accessTokenLocalKey);
  removeLocal(refreshTokenLocalKey);
}

export { setToken, refreshToken, getToken, isLogined, destroyTokens };
