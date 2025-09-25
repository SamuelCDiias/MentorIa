document.addEventListener("DOMContentLoaded", () => {
        const navbar = document.getElementById("navbar");
        let lastScrollY = window.scrollY;

        // Melhor controle de scroll para navbar
        window.addEventListener("scroll", () => {
          const currentScrollY = window.scrollY;
          if (lastScrollY < currentScrollY && currentScrollY > 100) {
            navbar.classList.add("nav-hidden");
          } else {
            navbar.classList.remove("nav-hidden");
          }
          lastScrollY = currentScrollY;
        });

        // Observer melhorado para revelar elementos
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("visible");

                // Animar estatísticas quando visíveis
                if (entry.target.querySelector(".number-counter")) {
                  animateCounters(entry.target);
                }

                // Animar gráficos quando visíveis
                if (entry.target.id === "progress-circle-1") {
                  animateProgressCircle();
                }

                if (entry.target.querySelector("#success-bar")) {
                  animateBars();
                }
              }
            });
          },
          {
            threshold: 0.2,
            rootMargin: "-50px 0px",
          }
        );

        document.querySelectorAll(".reveal-on-scroll").forEach((el) => {
          observer.observe(el);
        });

        // Função para animar contadores
        function animateCounters(container) {
          const counters = container.querySelectorAll(".number-counter");
          counters.forEach((counter) => {
            const target = parseInt(counter.getAttribute("data-target"));
            let count = 0;
            const increment = target / 60; // 60 frames para suavidade

            const updateCounter = () => {
              if (count < target) {
                count += increment;
                counter.textContent = Math.ceil(count);
                requestAnimationFrame(updateCounter);
              } else {
                counter.textContent = target;
              }
            };

            setTimeout(() => updateCounter(), 300);
          });
        }

        // Função para animar círculo de progresso
        function animateProgressCircle() {
          const circle = document.getElementById("progress-circle-1");
          if (circle) {
            setTimeout(() => {
              circle.style.strokeDashoffset = "37.699";
            }, 500);
          }
        }

        // Função para animar barras
        function animateBars() {
          const successBar = document.getElementById("success-bar");
          const failureBar = document.getElementById("failure-bar");

          if (successBar && failureBar) {
            setTimeout(() => {
              successBar.style.height = "32px"; // 9% relative
              failureBar.style.height = "160px"; // 91% relative
            }, 500);
          }
        }

        // Modal management
        const modal = document.getElementById("waitlist-modal");
        const overlay = document.getElementById("modal-overlay");
        const modalContent = document.getElementById("modal-content");
        const openModalButtons =
          document.querySelectorAll(".open-modal-button");
        const closeModalButton = document.getElementById("close-modal-button");
        const waitlistForm = document.getElementById("waitlist-form");
        const feedbackMessage = document.getElementById("form-feedback");

        const openModal = () => {
          modal.classList.remove("hidden");
          document.body.style.overflow = "hidden";
          setTimeout(() => {
            overlay?.classList.add("opacity-100");
            modalContent?.classList.remove("scale-95", "opacity-0");
            modalContent?.classList.add("scale-100", "opacity-100");
          }, 10);
        };

        const closeModal = () => {
          overlay?.classList.remove("opacity-100");
          modalContent?.classList.remove("scale-100", "opacity-100");
          modalContent?.classList.add("scale-95", "opacity-0");
          document.body.style.overflow = "";
          setTimeout(() => {
            modal?.classList.add("hidden");
            if (feedbackMessage) {
              feedbackMessage.textContent = "";
              feedbackMessage.className = "mt-4 text-sm";
            }
            waitlistForm?.reset();
          }, 300);
        };

        openModalButtons.forEach((button) => {
          button.addEventListener("click", (e) => {
            e.preventDefault();

            // Efeito de ripple
            const ripple = document.createElement("span");
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                `;

            button.style.position = "relative";
            button.style.overflow = "hidden";
            button.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
            setTimeout(() => openModal(), 100);
          });
        });

        closeModalButton?.addEventListener("click", closeModal);
        overlay?.addEventListener("click", closeModal);

        // Fechar modal com ESC
        document.addEventListener("keydown", (e) => {
          if (e.key === "Escape" && !modal.classList.contains("hidden")) {
            closeModal();
          }
        });

        waitlistForm?.addEventListener("submit", (e) => {
          e.preventDefault();
          const emailInput = document.getElementById("email-input");
          const email = emailInput ? emailInput.value : "";

          if (feedbackMessage) {
            feedbackMessage.innerHTML = `
                    <div class="flex items-center gap-2 text-green-600">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span>Perfeito! ${email} foi adicionado à nossa lista.</span>
                    </div>
                `;
          }

          // Confetti effect
          createConfetti();
          setTimeout(closeModal, 3000);
        });

        // Confetti function
        function createConfetti() {
          const colors = ["#3f78c0", "#6dbca2", "#a8d975"];
          for (let i = 0; i < 50; i++) {
            const confetti = document.createElement("div");
            confetti.style.cssText = `
                    position: fixed;
                    width: 10px;
                    height: 10px;
                    background: ${
                      colors[Math.floor(Math.random() * colors.length)]
                    };
                    left: ${Math.random() * 100}vw;
                    top: -10px;
                    z-index: 1000;
                    border-radius: 50%;
                    animation: confetti-fall 3s linear forwards;
                    pointer-events: none;
                `;
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 3000);
          }
        }

        // Enhanced habit generator
        const generateButton = document.getElementById("generate-habit-button");
        const goalInput = document.getElementById("goal-input");
        const habitResultContainer = document.getElementById("habit-result");
        const loader = document.getElementById("loader");

        // Auto-suggestions
        const suggestions = [
          "Meditar 5 minutos por dia",
          "Ler 10 páginas antes de dormir",
          "Fazer exercícios 3x por semana",
          "Beber 8 copos de água diariamente",
          "Escrever em um diário",
          "Aprender um idioma novo",
        ];

        goalInput?.addEventListener("focus", () => {
          if (!goalInput.value) {
            goalInput.placeholder =
              suggestions[Math.floor(Math.random() * suggestions.length)];
          }
        });

        generateButton?.addEventListener("click", async () => {
          const userGoal = goalInput ? goalInput.value.trim() : "";
          if (!userGoal) {
            if (habitResultContainer) {
              habitResultContainer.style.display = "block";
              habitResultContainer.innerHTML = `
                        <div class="flex items-center gap-2 text-yellow-600">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"></path>
                            </svg>
                            <span>Por favor, insira um objetivo para começar.</span>
                        </div>
                    `;
              setTimeout(() => goalInput.focus(), 100);
            }
            return;
          }

          if (loader) loader.style.display = "block";
          if (habitResultContainer) {
            habitResultContainer.style.display = "none";
            habitResultContainer.innerHTML = "";
          }
          if (generateButton) {
            generateButton.disabled = true;
            generateButton.innerHTML =
              '<div class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>';
          }

          const apiKey = "";
          const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
          const systemPrompt =
            "Você é a MentorIA, uma IA especialista em ciência comportamental e criação de sistemas de alta performance. Sua missão é ajudar usuários a construir hábitos atômicos. Seja conciso, encorajador e prático. Responda em markdown.";
          const userQuery = `Meu objetivo é "${userGoal}". Me dê 2 ou 3 sugestões de primeiros hábitos atômicos. Apresente em lista com título e breve explicação.`;

          try {
            const response = await fetch(apiUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts: [{ text: userQuery }] }],
                systemInstruction: { parts: [{ text: systemPrompt }] },
              }),
            });

            if (!response.ok)
              throw new Error(`HTTP error! status: ${response.status}`);
            const result = await response.json();
            const candidate = result.candidates?.[0];

            if (candidate?.content?.parts?.[0]?.text) {
              let text = candidate.content.parts[0].text;
              text = text
                .replace(
                  /\*\*(.*?)\*\*/g,
                  '<strong class="text-brand-dark-blue">$1</strong>'
                )
                .replace(
                  /^#{1,6}\s*(.*)/gm,
                  `<h4 class="text-lg font-bold text-slate-800 mb-3 mt-4 flex items-center gap-2"><svg class="w-5 h-5 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>$1</h4>`
                )
                .replace(
                  /^\s*[\-\*]\s(.*)/gm,
                  `<li class="flex items-start gap-3 mb-4 p-3 bg-gradient-to-r from-slate-50 to-transparent rounded-lg border-l-4 border-brand-teal"><svg class="w-5 h-5 text-brand-teal mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span>$1</span></li>`
                )
                .replace(/<\/li>\n/g, "</li>");

              if (habitResultContainer) {
                habitResultContainer.innerHTML = `
                            <div class="space-y-2">
                                <div class="flex items-center gap-2 mb-4">
                                    <div class="w-8 h-8 bg-gradient-to-r from-brand-mid-blue to-brand-teal rounded-full flex items-center justify-center">
                                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                                        </svg>
                                    </div>
                                    <h4 class="text-lg font-bold text-slate-800">Seus próximos passos:</h4>
                                </div>
                                <ul class="list-none space-y-2">${text}</ul>
                                <div class="mt-6 p-4 bg-gradient-to-r from-brand-light-green/20 to-brand-teal/20 rounded-lg border border-brand-teal/30">
                                    <p class="text-sm text-slate-600 flex items-center gap-2">
                                        <svg class="w-4 h-4 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                        <strong>Dica:</strong> Comece com apenas UM hábito por vez. A consistência é mais importante que a intensidade.
                                    </p>
                                </div>
                            </div>
                        `;
              }
            } else {
              if (habitResultContainer) {
                habitResultContainer.innerHTML = `
                            <div class="flex items-center gap-2 text-red-600">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span>Não foi possível gerar uma sugestão. Tente novamente.</span>
                            </div>
                        `;
              }
            }
          } catch (error) {
            console.error("Error calling Gemini API:", error);
            if (habitResultContainer) {
              habitResultContainer.innerHTML = `
                        <div class="flex items-center gap-2 text-red-600">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span>Ocorreu um erro ao contatar a IA. Por favor, tente novamente.</span>
                        </div>
                    `;
            }
          } finally {
            if (loader) loader.style.display = "none";
            if (habitResultContainer)
              habitResultContainer.style.display = "block";
            if (generateButton) {
              generateButton.disabled = false;
              generateButton.innerHTML = "<span>✨ Gerar Hábito</span>";
            }
          }
        });

        // Smooth scrolling para links internos
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
          anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
              target.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }
          });
        });

        // Adicionar estilos dinâmicos para animações
        const style = document.createElement("style");
        style.textContent = `
            @keyframes confetti-fall {
                to { transform: translateY(100vh) rotate(360deg); }
            }
            
            @keyframes ripple {
                to { transform: scale(2); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
      });