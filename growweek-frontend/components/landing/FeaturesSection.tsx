export function FeaturesSection() {
  const features = [
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
      ),
      title: "칸반 보드로 할일 관리",
      description:
        "TODO, 진행 중, 완료, 취소 4단계로 할일을 체계적으로 관리하세요. 드래그 앤 드롭으로 상태를 쉽게 변경할 수 있습니다.",
      highlights: ["4단계 상태 관리", "드래그 앤 드롭", "우선순위 설정"],
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
      title: "AI 기반 회고 질문",
      description:
        "한 주의 할일을 바탕으로 AI가 맞춤형 회고 질문을 생성합니다. 깊이 있는 성찰로 더 나은 다음 주를 계획하세요.",
      highlights: ["맞춤형 질문 생성", "마크다운 답변", "추가 메모 작성"],
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      title: "성장 통계 및 분석",
      description:
        "완료율, 취소율 등 다양한 통계로 자신의 패턴을 파악하세요. 월별 회고를 모아보며 장기적인 성장을 확인하세요.",
      highlights: ["주간/월간 통계", "완료율 분석", "성장 트렌드"],
    },
  ];

  return (
    <section
      id="features"
      className="py-20 md:py-32 bg-white dark:bg-stone-900"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-lime-100 dark:bg-lime-900/30 rounded-full mb-4">
            <span className="text-sm font-medium text-lime-700 dark:text-lime-300">
              주요 기능
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-100 mb-4">
            성장을 위한 모든 도구
          </h2>
          <p className="text-lg text-stone-600 dark:text-stone-400">
            할일 관리부터 회고까지, 주간 성장 사이클을 완성하세요
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-stone-50 dark:bg-stone-800/50 rounded-xl p-6 border border-stone-200 dark:border-stone-800 hover:border-lime-300 dark:hover:border-lime-800 transition-all duration-300"
            >
              {/* Icon */}
              <div className="w-12 h-12 bg-lime-100 dark:bg-lime-900/30 rounded-xl flex items-center justify-center text-lime-600 dark:text-lime-400 mb-5 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-3">
                {feature.title}
              </h3>
              <p className="text-stone-600 dark:text-stone-400 mb-5 leading-relaxed">
                {feature.description}
              </p>

              {/* Highlights */}
              <div className="flex flex-wrap gap-2">
                {feature.highlights.map((highlight, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 text-xs font-medium bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 rounded-full border border-stone-200 dark:border-stone-700"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Additional features list */}
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              ),
              text: "주간 기반 관리",
            },
            {
              icon: (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              ),
              text: "회고 후 할일 잠금",
            },
            {
              icon: (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              ),
              text: "마크다운 지원",
            },
            {
              icon: (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              ),
              text: "다크모드 지원",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-4 bg-stone-50 dark:bg-stone-800/50 rounded-lg"
            >
              <div className="text-lime-600 dark:text-lime-400">{item.icon}</div>
              <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
