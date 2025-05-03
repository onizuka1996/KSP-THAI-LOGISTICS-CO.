// ====== u0e2au0e04u0e23u0e34u0e1bu0e15u0e4cu0e2au0e33u0e2bu0e23u0e31u0e1a KSP THAI LOGISTICS CO., LTD ======

document.addEventListener('DOMContentLoaded', function() {
    // u0e40u0e21u0e19u0e39u0e21u0e37u0e2du0e16u0e37u0e2d
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
    
    // u0e1bu0e38u0e48u0e21u0e2au0e21u0e31u0e04u0e23u0e07u0e32u0e19
    const jobApplyButtons = document.querySelectorAll('.job-apply-btn');
    const jobPositionInput = document.getElementById('job-position');
    
    if (jobApplyButtons.length > 0 && jobPositionInput) {
        jobApplyButtons.forEach(button => {
            button.addEventListener('click', function() {
                const jobTitle = this.getAttribute('data-job');
                jobPositionInput.value = jobTitle;
                
                // u0e40u0e25u0e37u0e48u0e2du0e19u0e44u0e1bu0e17u0e35u0e48u0e41u0e1au0e1au0e1fu0e2du0e23u0e4cu0e21
                const applicationForm = document.getElementById('application-form');
                if (applicationForm) {
                    applicationForm.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }
    
    // u0e01u0e32u0e23u0e15u0e23u0e27u0e08u0e2au0e2du0e1au0e41u0e1au0e1au0e1fu0e2du0e23u0e4cu0e21u0e2au0e21u0e31u0e04u0e23u0e07u0e32u0e19
    const jobApplicationForm = document.getElementById('job-application-form');
    
    if (jobApplicationForm) {
        jobApplicationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // u0e15u0e23u0e27u0e08u0e2au0e2du0e1au0e04u0e27u0e32u0e21u0e16u0e39u0e01u0e15u0e49u0e2du0e07u0e02u0e2du0e07u0e41u0e1au0e1au0e1fu0e2du0e23u0e4cu0e21
            if (this.checkValidity()) {
                // u0e2au0e48u0e07u0e41u0e1au0e1au0e1fu0e2du0e23u0e4cu0e21u0e2au0e33u0e40u0e23u0e47u0e08
                alert('u0e2au0e48u0e07u0e43u0e1au0e2au0e21u0e31u0e04u0e23u0e2au0e33u0e40u0e23u0e47u0e08! u0e40u0e23u0e32u0e08u0e30u0e15u0e34u0e14u0e15u0e48u0e2du0e01u0e25u0e31u0e1au0e44u0e1bu0e2bu0e32u0e04u0e38u0e13u0e43u0e19u0e40u0e23u0e47u0e27u0e46 u0e19u0e35u0e49');
                this.reset();
            } else {
                alert('u0e01u0e23u0e38u0e13u0e32u0e01u0e23u0e2du0e01u0e02u0e49u0e2du0e21u0e39u0e25u0e43u0e2bu0e49u0e04u0e23u0e1au0e16u0e49u0e27u0e19');
            }
        });
    }
    
    // u0e01u0e32u0e23u0e15u0e23u0e27u0e08u0e2au0e2du0e1au0e41u0e1au0e1au0e1fu0e2du0e23u0e4cu0e21u0e41u0e08u0e49u0e07u0e1bu0e31u0e0du0e2bu0e32
    const employeeIssueForm = document.getElementById('employee-issue-form');
    
    if (employeeIssueForm) {
        employeeIssueForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // u0e15u0e23u0e27u0e08u0e2au0e2du0e1au0e04u0e27u0e32u0e21u0e16u0e39u0e01u0e15u0e49u0e2du0e07u0e02u0e2du0e07u0e41u0e1au0e1au0e1fu0e2du0e23u0e4cu0e21
            if (this.checkValidity()) {
                // u0e2au0e23u0e49u0e32u0e07u0e2bu0e21u0e32u0e22u0e40u0e25u0e02u0e15u0e34u0e14u0e15u0e32u0e21
                const ticketId = 'T' + Date.now().toString().slice(-6);
                
                // u0e2au0e48u0e07u0e41u0e1au0e1au0e1fu0e2du0e23u0e4cu0e21u0e2au0e33u0e40u0e23u0e47u0e08
                alert('u0e2au0e48u0e07u0e41u0e1au0e1au0e1fu0e2du0e23u0e4cu0e21u0e41u0e08u0e49u0e07u0e1bu0e31u0e0du0e2bu0e32u0e2au0e33u0e40u0e23u0e47u0e08! u0e2bu0e21u0e32u0e22u0e40u0e25u0e02u0e15u0e34u0e14u0e15u0e32u0e21u0e02u0e2du0e07u0e04u0e38u0e13u0e04u0e37u0e2d: ' + ticketId);
                this.reset();
            } else {
                alert('u0e01u0e23u0e38u0e13u0e32u0e01u0e23u0e2du0e01u0e02u0e49u0e2du0e21u0e39u0e25u0e43u0e2bu0e49u0e04u0e23u0e1au0e16u0e49u0e27u0e19');
            }
        });
    }
    
    // u0e15u0e23u0e27u0e08u0e2au0e2du0e1au0e2au0e16u0e32u0e19u0e30u0e01u0e32u0e23u0e41u0e08u0e49u0e07u0e1bu0e31u0e0du0e2bu0e32
    const statusCheckButton = document.querySelector('.status-check-button .btn');
    
    if (statusCheckButton) {
        statusCheckButton.addEventListener('click', function() {
            const ticketId = document.getElementById('ticket-id').value;
            const employeeId = document.getElementById('employee-id-check').value;
            
            if (ticketId && employeeId) {
                // u0e08u0e33u0e25u0e2du0e07u0e01u0e32u0e23u0e15u0e23u0e27u0e08u0e2au0e2du0e1au0e2au0e16u0e32u0e19u0e30
                const statusResult = document.querySelector('.status-result');
                
                if (statusResult) {
                    statusResult.style.display = 'block';
                    statusResult.innerHTML = `
                        <h3>u0e2au0e16u0e32u0e19u0e30u0e01u0e32u0e23u0e41u0e08u0e49u0e07u0e1bu0e31u0e0du0e2bu0e32 #${ticketId}</h3>
                        <div class="status-details">
                            <p><strong>u0e2au0e16u0e32u0e19u0e30:</strong> <span class="status-badge">u0e01u0e33u0e25u0e31u0e07u0e14u0e33u0e40u0e19u0e34u0e19u0e01u0e32u0e23</span></p>
                            <p><strong>u0e1cu0e39u0e49u0e23u0e31u0e1au0e1cu0e34u0e14u0e0au0e2du0e1a:</strong> u0e17u0e35u0e21u0e1au0e23u0e34u0e01u0e32u0e23u0e25u0e39u0e01u0e04u0e49u0e32</p>
                            <p><strong>u0e27u0e31u0e19u0e17u0e35u0e48u0e23u0e31u0e1au0e41u0e08u0e49u0e07:</strong> ${new Date().toLocaleDateString('th-TH')}</p>
                            <p><strong>u0e04u0e32u0e14u0e27u0e48u0e32u0e08u0e30u0e41u0e25u0e49u0e27u0e40u0e2au0e23u0e47u0e08:</strong> ${new Date(Date.now() + 2*24*60*60*1000).toLocaleDateString('th-TH')}</p>
                            <p><strong>u0e2bu0e21u0e32u0e22u0e40u0e2bu0e15u0e38:</strong> u0e17u0e35u0e21u0e07u0e32u0e19u0e02u0e2du0e07u0e40u0e23u0e32u0e01u0e33u0e25u0e31u0e07u0e15u0e23u0e27u0e08u0e2au0e2du0e1au0e1bu0e31u0e0du0e2bu0e32u0e02u0e2du0e07u0e04u0e38u0e13 u0e41u0e25u0e30u0e08u0e30u0e15u0e34u0e14u0e15u0e48u0e2du0e01u0e25u0e31u0e1au0e20u0e32u0e22u0e43u0e19 48 u0e0au0e31u0e48u0e27u0e42u0e21u0e07</p>
                        </div>
                    `;
                }
            } else {
                alert('u0e01u0e23u0e38u0e13u0e32u0e01u0e23u0e2du0e01u0e2bu0e21u0e32u0e22u0e40u0e25u0e02u0e15u0e34u0e14u0e15u0e32u0e21u0e41u0e25u0e30u0e23u0e2bu0e31u0e2au0e1eu0e19u0e31u0e01u0e07u0e32u0e19');
            }
        });
    }
});
