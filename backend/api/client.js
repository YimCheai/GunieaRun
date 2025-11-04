// 서버 주소 설정 (일단 환경 변수를 받았다고 치자..)
const serverUrl = process.env.API_BASE || "";
// 아직 process.env.API_BASE || "" 는 이해 못함... 뭐지?

async function requestServer(apiPath, { httpMethod = "GET", dataToSend, authToken } = {}) {
  const headerInfo = { "Content-Type": "application/json" };
  
  if (authToken) headerInfo["Authorization"] = `Bearer ${authToken}`; // 여기는 아직 이해가 안 간다~~~~~~~~~~ Bearer는 운송자인데??

  const serverResponse = await fetch(`${serverUrl}${apiPath}`, {
    method: httpMethod,
    headers: headerInfo,
    body: dataToSend ? JSON.stringify(dataToSend) : undefined,
  });

  const responseText = await serverResponse.text();
  
  let resultData;
  
  try { 
    resultData = responseText ? JSON.parse(responseText) : {}; 
  } catch { 
    // raw가 생 것? 날 것? 의미라 그런 듯.
    resultData = { raw: responseText }; 
  }

  // 서버 응답이 실패 / 데이터에 ok: false가 있으면 에러 발생    선택적 체이닝 - a.?b a가 있어, 그러면 b해. 근데 a가 없어? 그러면 오류 없이 undefined를 반환.
  if (!serverResponse.ok || resultData?.ok === false) {
    // 에러 메시지를 여러 곳에서 찾아서 사용
    const errorMessage = resultData?.error || serverResponse.statusText || "요청 실패";
    throw new Error(`[API] ${httpMethod} ${apiPath} -> ${errorMessage}`);
  }
  return resultData;
}

export const item_Types = Object.freeze({ 
  Hat: "hat", 
  Ribbon: "ribbon" 
});

export const fruit_Scores = Object.freeze({ 
  peach: 10, 
  cherry: 20 
});

export { requestServer as request };