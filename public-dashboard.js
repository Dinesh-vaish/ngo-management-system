class PublicPortalEngine {
    constructor() {
        this.selectedAmount = "5000";
        this.mockLedgerData = [
            { ref: "TXN-90812", item: "Purchase of 50 Winter Food Kits", value: "₹65,000", status: "Verified Field Voucher" },
            { ref: "TXN-90765", item: "Primary School Solar Inverter Fix", value: "₹1,24,000", status: "Verified Field Voucher" },
            { ref: "TXN-90432", item: "Honorarium Deployment: 12 Medical Field Interns", value: "₹96,000", status: "Verified Field Voucher" },
            { ref: "TXN-89912", item: "Emergency Logistics Truck Procurement (Rations)", value: "₹42,500", status: "Verified Field Voucher" }
        ];
        this.mockDonors = [
            { name: "Narayana CSR Matrix", amount: "₹2,50,000" },
            { name: "Suresh Chandra K.", amount: "₹15,000" },
            { name: "Vanguard Tech India", amount: "₹1,00,000" },
            { name: "Priya Sharma Foundation", amount: "₹50,000" }
        ];
        this.init();
    }

    init() {
        this.renderLedger();
        this.renderDonorWall();
        this.bindEvents();
    }

    bindEvents() {
        // Toggle processing amounts values
        const amtBtns = document.querySelectorAll('.amt-btn');
        amtBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                amtBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.selectedAmount = e.target.getAttribute('data-val');
            });
        });

        // Form submission capture
        const form = document.getElementById('donation-gateway-mock');
        form.addEventListener('submit', (e) => this.executeDonationMock(e));
    }

    renderLedger() {
        const tbody = document.getElementById('audit-ledger-rows');
        tbody.innerHTML = this.mockLedgerData.map(row => `
            <tr>
                <td><code>${row.ref}</code></td>
                <td><strong>${row.item}</strong></td>
                <td><span style="color:#0f5132; font-weight:700;">${row.value}</span></td>
                <td><span class="status-pill verified">${row.status}</span></td>
            </tr>
        `).join('');
    }

    renderDonorWall() {
        const wall = document.getElementById('donor-wall');
        wall.innerHTML = this.mockDonors.map(donor => `
            <div class="wall-row">
                <span class="donor-identity">${donor.name}</span>
                <span class="donor-badge-val">${donor.amount}</span>
            </div>
        `).join('');
    }

    executeDonationMock(e) {
        e.preventDefault();
        
        const donorName = document.getElementById('donor-name').value;
        const formattedCurrency = "₹" + parseInt(this.selectedAmount).toLocaleString('en-IN');

        // Alert mechanism to demonstrate completion of payment mock flow
        alert(`Thank you for your trust!\n\nTransaction Authorized successfully for ${formattedCurrency}.\nAn 80G tax receipt blueprint certificate has been triggered for delivery to execution channels.`);

        // Append live transaction onto our view matrix states instantly
        this.mockDonors.unshift({
            name: donorName,
            amount: formattedCurrency
        });

        this.renderDonorWall();
        document.getElementById('donation-gateway-mock').reset();
    }
}

// Global invocation tracking initialization
document.addEventListener("DOMContentLoaded", () => {
    new PublicPortalEngine();
});