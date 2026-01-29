export function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "주간 할일 작성",
      description:
        "이번 주 할일을 작성하고 우선순위를 설정하세요.",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      ),
    },
    {
      step: "02",
      title: "매일 진행 상황 업데이트",
      description:
        "드래그 앤 드롭으로 할일 상태를 변경하세요.",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 6h16M4 10h16M4 14h16M4 18h16"
          />
        </svg>
      ),
    },
    {
      step: "03",
      title: "주말에 회고 작성",
      description:
        "AI 질문에 답하며 한 주를 돌아보세요.",
      icon: (
        <svg
          className="w-8 h-8"
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
    },
    {
      step: "04",
      title: "월간 리뷰로 성장 확인",
      description:
        "월별 회고로 장기적인 성장을 확인하세요.",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-20 md:py-32 bg-stone-50 dark:bg-stone-950"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-lime-100 dark:bg-lime-900/30 rounded-full mb-4">
            <span className="text-sm font-medium text-lime-700 dark:text-lime-300">
              사용 방법
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-100 mb-4 text-balance word-keep-all">
            간단한 4단계로 시작하세요
          </h2>
          <p className="text-lg text-stone-600 dark:text-stone-400 text-balance word-keep-all">
            매주 반복되는 성장 사이클로 꾸준히 발전하세요
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-lime-300 dark:via-lime-800 to-transparent" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Step card */}
                <div className="bg-white dark:bg-stone-900 rounded-xl p-6 border border-stone-200 dark:border-stone-800 h-full">
                  {/* Step number */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-4xl font-bold text-lime-400">
                      {step.step}
                    </span>
                    <div className="w-14 h-14 bg-lime-100 dark:bg-lime-900/30 rounded-xl flex items-center justify-center text-lime-600 dark:text-lime-400">
                      {step.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-pretty word-keep-all">
                    {step.description}
                  </p>
                </div>

                {/* Arrow for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute -right-4 top-24 z-10 w-8 h-8 bg-white dark:bg-stone-900 rounded-full border border-stone-200 dark:border-stone-800 items-center justify-center">
                    <svg
                      className="w-4 h-4 text-lime-600 dark:text-lime-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Weekly cycle visualization */}
        <div className="mt-20 bg-white dark:bg-stone-900 rounded-2xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800">
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-2 text-balance word-keep-all">
              주간 성장 사이클
            </h3>
            <p className="text-stone-600 dark:text-stone-400 text-balance word-keep-all">
              일주일 동안의 흐름을 한눈에 확인하세요
            </p>
          </div>

          <div className="grid grid-cols-7 gap-1.5 sm:gap-4 max-w-md sm:max-w-2xl mx-auto">
            {["월", "화", "수", "목", "금", "토", "일"].map((day, idx) => (
              <div key={day} className="text-center">
                <div
                  className={`w-9 h-9 sm:w-14 sm:h-14 mx-auto rounded-lg sm:rounded-xl flex items-center justify-center mb-1 sm:mb-2 ${
                    idx === 0
                      ? "bg-lime-400 text-stone-900"
                      : idx === 6
                        ? "bg-lime-100 dark:bg-lime-900/30 border-2 border-lime-400 text-lime-600 dark:text-lime-400"
                        : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400"
                  }`}
                >
                  <span className="text-xs sm:text-base font-semibold">{day}</span>
                </div>
                <span className="hidden sm:block text-xs text-stone-500 dark:text-stone-500">
                  {idx === 0 ? "할일 작성" : idx === 6 ? "회고 마감" : "진행 관리"}
                </span>
                <span className="sm:hidden text-[10px] text-stone-500 dark:text-stone-500">
                  {idx === 0 ? "할일 작성" : idx === 3 ? "진행 관리" : idx === 6 ? "회고 마감" : "\u00A0"}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-stone-500 dark:text-stone-500 text-balance word-keep-all">
              <span className="inline-flex items-center gap-1">
                <svg
                  className="w-4 h-4 text-lime-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                회고는 다음 주 월요일 0시까지 작성 가능합니다
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
