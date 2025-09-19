(function () {
    // const urlScriptLayanan = "https://script.google.com/macros/s/AKfycbzaz9OT6qh_cBYjsszT4KX-rUUUVCWymK8RqjI0OpK7OLXS1PYREX0z7rPbu6r3lNJv/exec";
    const urlScriptLayanan = "https://script.google.com/macros/s/AKfycbxObHJF8mESnUWIPnpxOmM_TOXzrit-boYe8erHhe8prfaHdIU82SuQUluxhdFFDtgh/exec";

    function main() {
        initServiceButtons();
        initHeaderToggle();
        initFormBantuan();
        initAccordion();
        initNavbarStyle();
        initSlider();
        initModal();
        initChat();
    }

    function initModal() {
        const modal = document.getElementById("myModal");
        if (!modal) return;

        const modalCloseBtn = document.getElementById("close-modal-btn");
        if (modalCloseBtn) {
            modalCloseBtn.addEventListener("click", function () {
                modal.classList.add('hidden');
            });
        }
    }

    function initNavbarStyle() {
        const header = document.querySelector("header");
        if (!header) return;
        const navbar = document.getElementById("navbar");
        const scrollThreshold = 100;
        window.addEventListener("scroll", function () {
            if (window.scrollY > scrollThreshold) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }
        });
    }

    function showModal(title, message, type="info") {
        const modal = document.getElementById("myModal");
        if (!modal) return;

        const modalHeader = modal.querySelector(".modal-header");
        const modalBody = modal.querySelector(".modal-body");
        const modalFooter = modal.querySelector(".modal-footer");
        
        modalHeader.className = `modal-header ${type}`;
        modalFooter.className = `modal-footer ${type}`;

        const modalTitle = modalHeader.querySelector(".modal-title");
        modalTitle.textContent = title;
        modalBody.textContent = message;

        modal.classList.remove("hidden");
    }

    function initFormBantuan() {
        const formBantuan = document.getElementById("form-bantuan");
        if (!formBantuan) return;

        formBantuan.addEventListener("submit", function (event) {
            event.preventDefault();

            const form = event.target;
            const formData = new FormData(form);

            for (let pair of formData.entries()) {
                console.log(pair)
                if (!pair[1].trim()) {
                    showModal(
                        "Peringatan",
                        `Harap isi semua kolom formulir. Kolom '${pair[0]}' kosong.`,
                        "danger"
                    );
                    return;
                }
            }

            fetch(urlScriptLayanan, {
                method: "POST",
                body: formData,
            })
                .then((response) => {
                    if (response.ok) {
                        showModal("Sukses!", "✅ Permohonan Anda Telah Diterima, Mohon Tunggu, Petugas kami akan menghampiri Anda dalam waktu maksimal 5 menit. Jika Anda membutuhkan bantuan lebih lanjut, silahkan hubungi Call Center kami di 0821-3400-1129.", "success");
                        form.reset(); // Clear the form after successful submission
                        console.log("success")
                    } else {
                        console.error(
                            "Failed to submit assistance form. Status:",
                            response.status
                        );
                        showModal(
                            "Error",
                            "Gagal mengirim formulir bantuan, coba lagi.",
                            "danger"
                        );
                    }
                })
                .catch((error) => {
                    console.error("Error submitting assistance form:", error);
                    showModal(
                        "Error",
                        "Terjadi error saat mengirim formulir bantuan!",
                        "danger"
                    );
                });
        });
    }

    function initSlider() {
        const container = document.querySelector(".slide");
        if (!container) return;

        const slides = container.querySelectorAll(".slide-item");
        if (slides.length < 1) return;

        let currentIndex = 0;
        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.remove('active', 'prev');
                if (i === index) {
                    slide.classList.add('active');
                } else if (i < index) {
                    slide.classList.add('prev');
                }
            });
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % slides.length;
            showSlide(currentIndex);
        }

        showSlide(currentIndex);
        setInterval(nextSlide, 6000);
    }

    function initHeaderToggle() {
        const navbar = document.getElementById("navbar");
        const closeBtn = document.getElementById("close-navbar-btn")
        const openNavbarBtn = document.getElementById("hamburger");
        if (!navbar || !closeBtn || !openNavbarBtn) return;

        closeBtn.addEventListener("click", function () {
            navbar.classList.remove("nav-open");
        });

        openNavbarBtn.addEventListener("click", function () {
            navbar.classList.add("nav-open");
        });
    }

    function initServiceButtons() {
        const layananSection = document.getElementById("layanan");

        if (!layananSection) return;

        function submitService(serviceString) {
            fetch(urlScriptLayanan, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({ "area": serviceString })
            })
                .then(response => {
                    showModal(
                        "Sukses!",
                        "✅ Permohonan Anda Telah Diterima, Mohon Tunggu, Petugas kami akan menghampiri Anda dalam waktu maksimal 5 menit. Jika Anda membutuhkan bantuan lebih lanjut, silahkan hubungi Call Center kami di 0821-3400-1129."
                    )
                    console.log(response);
                })
                .catch(error => {
                    console.error("Error submitting service: ", error);
                    alert("Terjadi kesalahan saat mengirim layanan. Silakan coba lagi.");
                })
            console.log(serviceString);
        }

        layananSection.addEventListener("click", function (event) {
            const button = event.target.closest(".btn-service");
            if (!button) return;

            const serviceElementArea = button.closest(".service-area");
            const areaName = serviceElementArea.dataset.areaName;
            const serviceType = button.dataset.serviceType;
            const serviceString = `${areaName} - ${serviceType}`;
            submitService(serviceString);
        });
    }

    function initAccordion() {
        const layananSection = document.getElementById('layanan');
        if (!layananSection) return;

        function updateMainPanelHeight() {
            const mainPanel = layananSection.querySelector('.service-head');
            if (mainPanel && mainPanel.style.maxHeight) {
                mainPanel.style.maxHeight = `${mainPanel.scrollHeight + 10}` + 'px';
            }
        }

        layananSection.addEventListener('click', function(event) {
            const button = event.target.closest('.accordion');
            if (!button) return;

            button.classList.toggle('active');

            let panel;
            if (button.dataset.accordionType === 'main') {
                panel = layananSection.querySelector('.service-head'); // Panel untuk tombol utama
            } else {
                panel = button.nextElementSibling; // Panel untuk tombol anak
            }

            if (!panel) return;
            
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = `${panel.scrollHeight + 10}` + 'px';
            }

            const icon = button.querySelector('.accordion-icon');
            if (icon) {
                if (panel.style.maxHeight) {
                    icon.innerHTML = icon.dataset.iconOpen || (button.dataset.accordionType === 'sub' ? '-' : '&#11165;');
                } else {
                    icon.innerHTML = icon.dataset.iconClosed || (button.dataset.accordionType === 'sub' ? '+' : '&#11167;');
                }
            }
            
            if (button.dataset.accordionType === 'sub') {
                setTimeout(updateMainPanelHeight, 120);
            }
        });
    }

    function initChat() {
        const chatButton = document.getElementById("chat-btn");
        const chatInput = document.getElementById("chat-input");
        const errorMessage = document.querySelector(".error-message");
        const sendChatBtn = document.getElementById("send-chat-btn");

        const chatBox = document.getElementById("chatbox");
        const closeChatBtn = document.getElementById("close-chat");

        const chatBody = document.getElementById("chat-body");
        let emptyChatPlaceholder = document.getElementById("empty-chat-placeholder");

        if (!chatBox || !closeChatBtn || !chatButton) return;

        function showError(message) {
            chatInput.classList.add("error");
            errorMessage.textContent = message;
            errorMessage.classList.add("visible");
        }

        function clearError() {
            chatInput.classList.remove("error");
            errorMessage.classList.remove("visible");
        }

        function sendMessage(message) {
            if (!chatBody) {
                console.error("Chat body not found.");
                return;
            }

            if (emptyChatPlaceholder) {
                emptyChatPlaceholder = emptyChatPlaceholder.remove();
            }

            let reply = "Pesan telah dikirim, kami akan membalas secepatnya.";
            if (message.toLowerCase().includes("bantuan")) {
                reply = "Bantuan akan segera diberikan.";
            } else if (message.toLowerCase().includes("susu")) {
                reply = "Bantuan susu akan segera diberikan.";
            }

            const userBubble = document.createElement("div");
            userBubble.className = "chat-message user";
            userBubble.textContent = message;
            chatBody.appendChild(userBubble);

            // Simulasi delay pembalasan admin
            setTimeout(() => {
                const adminBubble = document.createElement("div");
                adminBubble.className = "chat-message admin";
                adminBubble.textContent = reply;
                chatBody.appendChild(adminBubble);
                chatBody.scrollTop = chatBody.scrollHeight;
            },
                500
            )

            fetch(urlScriptLayanan, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    "pesan": message,
                    "reply": reply,
                })
            })
                .then((response) => {
                    if (!response.ok) {
                        console.error(
                            "Failed to send chat message to Google Script. Status:",
                            response.status
                        );
                        // No alert for chat sending failure, just log
                    }
                    return response.text(); // Read response as text
                })
                .then((data) => console.log("Google Script Response:", data))
                .catch((error) =>
                    console.error("Error sending chat message:", error.message)
                );
        }

        chatButton.addEventListener("click", function () {
            this.classList.toggle('hidden');
            chatBox.classList.remove('hidden');

            if (!emptyChatPlaceholder) {
                chatBody.scrollTop = chatBody.scrollHeight;
            }
        });

        closeChatBtn.addEventListener("click", function () {
            chatButton.classList.toggle('hidden');
            chatBox.classList.add('hidden')
            clearError();
        });


        chatButton.addEventListener("click", function () {
            const chatSection = document.getElementById("chat");
            if (chatSection) {
                chatSection.classList.toggle("hidden");
            }
        });

        sendChatBtn.addEventListener("click", function () {
            const message = chatInput.value.trim();
            if (message === "") {
                showError("Pesan tidak boleh kosong.");
                return;
            } else {
                chatInput.value = "";
                sendMessage(message);
                console.log("Pesan terkirim:", message);
            }
        });

        chatInput.addEventListener("input", function () {
            if (this.classList.contains('error')) {
                clearError();
            }
        });
    }

    document.addEventListener("DOMContentLoaded", main);

    document.addEventListener("DOMContentLoaded", function () {
        // otomatis buka panel utama layanan cepat
        const mainAccordion = document.querySelector('.accordion[data-accordion-type="main"]');
        if (mainAccordion && !mainAccordion.classList.contains("active")) {
            mainAccordion.click(); 
        }

        // otomatis buka panel sub "Lift Waiting Room Domestik"
        const subAccordion = document.querySelector('.accordion[data-accordion-type="sub"][data-service-type="Lift Waiting Room Domestik"]');
        if (subAccordion && !subAccordion.classList.contains("active")) {
            subAccordion.click();
        }
    });






})();
