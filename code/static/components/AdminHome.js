export default {
    template: `
    <div class="home-container">
        <div class="content-wrapper">
            <div class="welcome-section">
                <h1 class="title">Welcome Admin</h1>
                <p class="subtitle">Manage Your Services</p>
            </div>

            <div class="action-section">
                <router-link to="/create-service" class="create-btn">
                    <i class="fas fa-plus-circle"></i> New Service
                </router-link>
            </div>

            <div class="services-card">
                <div class="card-header">
                    <div class="header-grid">
                        <div class="header-item">
                            <i class="fas fa-hashtag"></i> ID
                        </div>
                        <div class="header-item">
                            <i class="fas fa-tools"></i> Service Name
                        </div>
                        <div class="header-item">
                            <i class="fas fa-rupee-sign"></i> Base Price
                        </div>
                        <div class="header-item">
                            <i class="fas fa-cogs"></i> Action
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <!-- Service items will be rendered here -->
                </div>
            </div>

            <div class="export-section" v-if="isWaiting">
                <div class="loading-spinner">
                    <i class="fas fa-spinner fa-spin"></i> Processing...
                </div>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            isWaiting: false
        }
    },
    methods: {
        async download_csv() {
            this.isWaiting = true;
            try {
                const res = await fetch('/download-csv');
                const data = await res.json();
                if (res.ok) {
                    const taskId = data['task-id'];
                    const intv = setInterval(async () => {
                        const csv_res = await fetch(`/get-csv/${taskId}`);
                        if (csv_res.ok) {
                            this.isWaiting = false;
                            clearInterval(intv);
                            window.location.href = `/get-csv/${taskId}`;
                        }
                    }, 1000);
                }
            } catch (err) {
                this.isWaiting = false;
                console.error('Download failed:', err);
            }
        },
        
            async downloadClosedRequests() {
                const apiUrl = '/export-closed-requests'; // Update with the actual API URL if different
            
                this.isWaiting = true; // Indicate loading state
                try {
                    const response = await fetch(apiUrl, { method: 'GET' });
            
                    console.log('Response object:', response); // Log the response object
            
                    if (!response.ok) {
                        const errorData = await response.json();
                        alert(errorData.message || 'Failed to fetch the CSV file.');
                        this.isWaiting = false;
                        return;
                    }
            
                    const csvContent = await response.text(); // Read CSV data
            
                    const blob = new Blob([csvContent], { type: 'text/csv' });
                    const downloadLink = document.createElement('a');
                    downloadLink.href = URL.createObjectURL(blob);
                    downloadLink.download = 'closed_requests.csv';
            
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);
            
                    alert('CSV downloaded successfully!');
                } catch (error) {
                    console.error('Error while downloading the CSV:', error); // Log the error for debugging
                    alert('An error occurred while trying to download the CSV. Check console logs for more details.');
                } finally {
                    this.isWaiting = false; // Reset loading state
                }
            }
            }
        
    }
   