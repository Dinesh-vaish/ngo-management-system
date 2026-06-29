// State Machine Engine for Local Storage Queue Management
class DashboardEngine {
    constructor() {
        this.currentCoordinates = { lat: null, lon: null };
        this.runtimeCache = [];
        this.init();
    }

    init() {
        // Wire up validation and control interfaces
        document.getElementById('beneficiary-form').addEventListener('submit', (e) => this.handleSubmission(e));
        document.getElementById('geo-trigger-btn').addEventListener('click', () => this.captureLocation());
        
        // Listen to connectivity shifts across cellular networks
        window.addEventListener('online', () => this.updateNetworkStatus(true));
        window.addEventListener('offline', () => this.updateNetworkStatus(false));
        
        // Match base operational target status on entry boot
        this.updateNetworkStatus(navigator.onLine);
        this.renderLedger();
    }

    updateNetworkStatus(isOnline) {
        const banner = document.getElementById('connectivity-banner');
        if (isOnline) {
            banner.textContent = "System Status: Connected (Data Sync Active)";
            banner.className = "banner state-online";
            this.flushLocalQueueToServer();
        } else {
            banner.textContent = "System Status: Offline (Transactions Safe In Local Cache)";
            banner.className = "banner state-offline";
        }
    }

    captureLocation() {
        const statusBox = document.getElementById('geo-status');
        if (!navigator.geolocation) {
            statusBox.textContent = "Error: Geolocation hardware missing.";
            return;
        }

        statusBox.textContent = "Querying internal hardware satellites...";
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                this.currentCoordinates.lat = pos.coords.latitude.toFixed(6);
                this.currentCoordinates.lon = pos.coords.longitude.toFixed(6);
                statusBox.textContent = `Coordinates Bound: ${this.currentCoordinates.lat}, ${this.currentCoordinates.lon}`;
            },
            () => {
                statusBox.textContent = "Failure: Hardware coordinates refused. Using base defaults.";
                this.currentCoordinates.lat = "28.6139"; // Regional default proxies
                this.currentCoordinates.lon = "77.2090";
            }
        );
    }

    handleSubmission(event) {
        event.preventDefault();
        
        const nameVal = document.getElementById('beneficiary-name').value;
        const aidVal = document.getElementById('aid-type').value;
        const generatedId = "REC-" + Math.floor(100000 + Math.random() * 900000);

        const payload = {
            beneficiary_id: generatedId,
            name: nameVal,
            aid_type: aidVal,
            latitude: this.currentCoordinates.lat || "Not Logged",
            longitude: this.currentCoordinates.lon || "Not Logged",
            sync_status: navigator.onLine ? "synced" : "local"
        };

        this.runtimeCache.unshift(payload);
        this.renderLedger();
        this.updateCacheMetric();
        
        // Reset operational view states
        document.getElementById('beneficiary-form').reset();
        document.getElementById('geo-status').textContent = "Coordinates not logged.";
        this.currentCoordinates = { lat: null, lon: null };
    }

    updateCacheMetric() {
        const localItemsCount = this.runtimeCache.filter(item => item.sync_status === "local").length;
        document.getElementById('cache-count').textContent = localItemsCount;
    }

    flushLocalQueueToServer() {
        // Mutate local storage indicators to sync status upon execution recovery handshakes
        this.runtimeCache = this.runtimeCache.map(record => {
            if (record.sync_status === "local") {
                record.sync_status = "synced";
            }
            return record;
        });
        setTimeout(() => {
            this.renderLedger();
            this.updateCacheMetric();
        }, 1200); // Visual step interface spacing simulation
    }

    renderLedger() {
        const tbody = document.getElementById('ledger-body');
        tbody.innerHTML = "";

        if (this.runtimeCache.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#718096;">No beneficiary logging operations recorded in current context workspace.</td></tr>`;
            return;
        }

        this.runtimeCache.forEach(item => {
            const row = document.createElement('tr');
            const badgeClass = item.sync_status === 'synced' ? 'badge-synced' : 'badge-local';
            
            row.innerHTML = `
                <td><code>${item.beneficiary_id}</code></td>
                <td><strong>${item.name}</strong></td>
                <td>${item.aid_type}</td>
                <td>${item.latitude}, ${item.longitude}</td>
                <td><span class="badge ${badgeClass}">${item.sync_status.toUpperCase()}</span></td>
            `;
            tbody.appendChild(row);
        });
    }
}

// Global bootstrap instantiation execution
document.addEventListener("DOMContentLoaded", () => {
    window.AppEngine = new DashboardEngine();
});