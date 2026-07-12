export interface QAEntry {
  question: string;
  answer: string;
  chapter: number;
  page: number;
}

export const qaBank: QAEntry[] = [
  {
    question: "LLM에서 다음에 올 단어는 어떻게 예측하는거야?",
    answer:
      "보통 지금까지 나온 문장을 보고 다음에 올 확률이 가장 높은 단어를 골라요. GPT 같은 모델은 트랜스포머 구조의 셀프 어텐션과 확률분포를 활용해 단어를 예측합니다.",
    chapter: 1,
    page: 24,
  },
  {
    question: "트랜스포머에서 셀프 어텐션이 중요하다고 하는데 그 이유가 뭐야?",
    answer:
      "셀프 어텐션이란 문장 속 각 단어를 query, key, value 벡터로 바꾼 뒤 query와 key의 유사도로 관련성을 계산해서 value를 가중합하는 구조예요. 순서대로 처리하는 RNN과 달리 문장 전체를 한 번에 보고 멀리 떨어진 단어끼리도 직접 연결할 수 있어서, 은행 같은 단어도 앞뒤 문맥의 가중치에 따라 금융기관인지 강가인지 구분해서 처리해요.",
    chapter: 1,
    page: 31,
  },
  {
    question: "토큰화는 왜 서브워드 단위로 하는 거야?",
    answer:
      "서브워드 단위가 아닌, 단어 전체를 통째로 다루는 방법을 사용하면 사전에 없는 신조어를 처리 못 해요. 그러나 BPE 같은 서브워드 토큰화는 단어를 작은 조각으로 쪼개서 새로운 단어도 조합해 표현할 수 있어요. 그래서 토큰화는 서브워드 단위로 진행해요.",
    chapter: 1,
    page: 18,
  },
  {
    question: "Instruct 모델은 사전학습 모델과 뭐가 달라?",
    answer:
      "GPT처럼 다음 단어를 잘 맞히도록 학습한 사전학습 모델과 달리, EXAONE-Instruct 같은 모델은 질문-답변 쌍으로 추가 학습해서 지시를 따르도록 만든 모델이라는 점에서 차이가 있어요.",
    chapter: 1,
    page: 40,
  },
  {
    question: "LLM에 같은 프롬프트를 넣어도 왜 답이 매번 달라질까?",
    answer:
      "모델이 확률분포에서 단어를 뽑는 샘플링 방식을 쓰기 때문이에요. temperature나 top_p 값을 조절하는 순간부터 매번 다른 토큰이 선택될 여지가 생겨요.",
    chapter: 2,
    page: 55,
  },
  {
    question: "자연어 처리 모델에서 문장의 다양성을 조절하려면 어떻게 해야해?",
    answer:
      "softmax로 만든 확률분포의 뾰족한 정도를 temperature로 바꾸고, top_k나 top_p로 후보 폭을 넓히거나 좁혀서 다양성을 조절해야 해요. temperature를 낮추면 확률이 높은 토큰에 더 쏠려 안정적인 문장이 나오고, 높이면 여러 토큰의 확률이 비슷해져서 더 예측하기 어려운 문장이 나오기 때문이에요.",
    chapter: 2,
    page: 61,
  },
  {
    question: "로지스틱 회귀는 왜 예측값에 시그모이드를 씌워?",
    answer:
      "선형회귀의 출력은 범위가 무한대라 확률로 해석할 수 없어서, 시그모이드 함수로 그 값을 0과 1 사이로 눌러 줘야 특정 클래스에 속할 확률로 쓸 수 있어요. 그래서 로지스틱 회귀는 선형결합 뒤에 시그모이드를 반드시 붙여요.",
    chapter: 2,
    page: 109,
  },
  {
    question: "KNN에서 K를 너무 크게 잡으면 왜 안 좋아?",
    answer:
      "K를 크게 잡을수록 먼 거리의 데이터까지 이웃으로 포함돼서 결정 경계가 지나치게 뭉뚱그려지는 과소적합이 일어나요. 반대로 K가 너무 작으면 노이즈 하나에도 민감하게 반응해서 과적합이 생겨요.",
    chapter: 2,
    page: 88,
  },
  {
    question: "SVM은 왜 마진을 최대화하는 방향으로 학습해?",
    answer:
      "마진이 클수록 결정 경계가 두 클래스로부터 최대한 멀리 떨어져 있다는 뜻이라서, 학습 데이터에 없던 새로운 데이터가 들어와도 잘못 분류될 여지가 줄어들어요. 그래서 SVM은 단순히 오차를 줄이는 것보다 마진을 최대화하는 걸 우선 목표로 삼아요.",
    chapter: 3,
    page: 47,
  },
  {
    question: "결정 트리는 왜 가지치기를 해줘야 해?",
    answer:
      "가지치기 없이 트리를 끝까지 키우면 훈련 데이터의 노이즈까지 전부 외워버려서 과적합이 심해져요. 트리 깊이나 리프 노드의 최소 샘플 수를 제한하는 가지치기를 하면 일반화 성능이 좋아져요.",
    chapter: 3,
    page: 52,
  },
  {
    question: "랜덤 포레스트는 왜 단일 결정 트리보다 안정적이야?",
    answer:
      "랜덤 포레스트는 데이터와 특성을 각각 무작위로 샘플링해 만든 여러 결정 트리를 앙상블로 묶은 구조예요. 트리마다 다른 방향으로 과적합돼도 다수결이나 평균으로 결과를 합치면 개별 트리의 오차가 서로 상쇄돼서 전체 분산이 줄어들어요.",
    chapter: 3,
    page: 66,
  },
  {
    question: "PCA는 차원을 줄이면서 어떻게 정보 손실을 최소화해?",
    answer:
      "PCA는 데이터의 분산이 가장 큰 방향을 주성분으로 잡아서, 그 방향으로 데이터를 투영했을 때 원래 데이터가 가진 정보를 최대한 보존하도록 축을 새로 구성해요. 분산이 작은 축은 버려도 정보 손실이 적기 때문에 차원을 줄여도 데이터 구조가 크게 왜곡되지 않아요.",
    chapter: 4,
    page: 73,
  },
  {
    question: "model.eval()을 안 하면 검증할 때 정확도가 왜 들쭉날쭉해?",
    answer:
      "model.train() 상태로 두면 검증할 때도 드롭아웃이 계속 무작위로 뉴런을 꺼버려서 추론할 때마다 다른 결과가 나와요. 검증이나 평가 단계에서는 model.eval()을 호출해서 드롭아웃과 배치 정규화를 추론 모드로 바꿔줘야 항상 같은 예측이 나와요.",
    chapter: 5,
    page: 102,
  },
  {
    question: "로짓과 확률의 관계를 수식으로 설명하면?",
    answer:
      "로짓 z를 softmax(z_i)=exp(z_i)/Σexp(z_j) 식에 넣으면 확률이 나와요. 지수함수 덕분에 로짓 순서는 유지되고 합이 1인 분포로 바뀌어요.",
    chapter: 2,
    page: 95,
  },
  {
    question: "use_cache=False로 생성하면 왜 속도가 느려져?",
    answer:
      "use_cache=False로 두면 매 스텝마다 이전에 생성한 토큰들의 key, value까지 처음부터 다시 계산해서, 생성한 토큰 수가 늘어날수록 계산량이 커져요. use_cache=True로 두면 이전 key, value를 캐시에 저장해두고 재사용해서 새 토큰 하나의 연산만 추가로 하면 되니까 훨씬 빨라져요.",
    chapter: 1,
    page: 45,
  },
  {
    question: "perplexity가 낮아도 품질이 나쁠 수 있는 이유가 뭐야?",
    answer:
      "perplexity는 다음 토큰 예측의 통계적 정확도만 재는 지표에요. 따라서, 문장이 문법적으로 그럴듯해도 사실관계가 틀리거나 다양성이 떨어지는 문제는 반영하지 못해요.",
    chapter: 1,
    page: 51,
  },
  {
    question: "temperature, top-k, top-p를 함께 쓰면 순서가 중요해?",
    answer:
      "네 중요해요. temperature가 먼저 분포 모양을 조정한 뒤 top_k와 top_p가 그 위에서 후보를 골라내는 순서로 적용되기 때문이에요. 순서를 바꾸면 최종 후보 집합이 달라져요.",
    chapter: 2,
    page: 63,
  },
  {
    question: "표준화가 왜 필요해?",
    answer:
      "특성마다 값의 범위가 다르면 값이 큰 특성이 거리나 경사하강법 계산을 사실상 독점해버려요. StandardScaler 같은 표준화로 평균 0, 분산 1로 맞춰주면 모든 특성이 비슷한 스케일에서 공평하게 학습에 반영돼요. 특히 KNN, SVM처럼 거리 기반 모델이나 경사하강법을 쓰는 모델에서 꼭 필요해요.",
    chapter: 2,
    page: 109,
  },
  {
    question: "배치 정규화는 왜 학습을 안정적으로 만들어줘?",
    answer:
      "배치 정규화는 각 층에 들어가는 입력값의 평균과 분산을 배치 단위로 맞춰줘서, 층을 통과할 때마다 입력 분포가 요동치는 내부 공변량 변화를 줄여줘요. 그 덕분에 학습률을 더 크게 잡아도 발산하지 않고 더 빠르고 안정적으로 수렴할 수 있어요.",
    chapter: 5,
    page: 118,
  },
  {
    question: "작업 종류에 따라 temperature를 다르게 잡는 이유를 설명해줘.",
    answer:
      "정답이 하나로 수렴해야 하는 작업은 분포를 뾰족하게 유지해야 일관된 답이 나오므로 0.2에서 0.5 정도의 낮은 temperature가 적합하고, 창작처럼 여러 그럴듯한 답이 공존해도 되는 작업은 0.7에서 1.0 정도로 분포를 넓혀야 다채로운 결과를 얻을 수 있어요.",
    chapter: 2,
    page: 67,
  },
];

const STOPWORDS = new Set([
  "그", "이", "저", "것", "수", "왜", "해", "해줘", "어떻게", "뭐야", "설명해줘",
  "설명하면", "이유가", "때문에", "하는", "하는거야", "이런", "거야", "있어",
  "그래서", "때", "너무",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[?.,!\n]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

export function findBestMatch(query: string): QAEntry | null {
  const queryTokens = new Set(tokenize(query));
  if (queryTokens.size === 0) return null;

  let best: QAEntry | null = null;
  let bestScore = 0;

  for (const entry of qaBank) {
    const entryTokens = tokenize(entry.question);
    let score = 0;
    for (const t of entryTokens) {
      if (queryTokens.has(t)) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  return bestScore > 0 ? best : null;
}
