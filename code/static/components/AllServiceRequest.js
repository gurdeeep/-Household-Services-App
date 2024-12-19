export default {
    template: `
    <div>
        <div class="container">
            <div class="row">
                <div class="col">
                    <h2 class="text-center" style="color: white;">Service Requests</h2>
                </div>
                <div class="col p-2 text-end">
                    <h6 class="text-primary">Download Details</h6>
                    <button 
                        class="download-btn" 
                        @click="downloadClosedRequests" 
                        :disabled="isWaiting">
                        <i class="fas fa-download"></i> Download Closed Requests
                    </button>
                    <span v-if="isWaiting">Waiting...</span>
                </div>
            </div>
        </div>
        <div class="card text-center" style="width: 77rem;">
            <div class="card-header">
                <div class="container text-center">
                    <div class="row row-cols-1 row-cols-sm-2 row-cols-md-4">
                        <div class="col">ID</div>
                        <div class="col">Service Name</div>
                        <div class="col">Date Of Request</div>
                        <div class="col">Status</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="card text-center" style="width: 77rem;">
            <ul class="list-group list-group-flush">
                <li class="list-group-item" v-for="(service_request, index) in allServiceRequests" :key="index">
                    <div class="container text-center">
                        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-4">
                            <div class="col">{{ service_request.id }}</div>
                            <div class="col">
                                <template v-for="(service, idx) in allServices" :key="idx">
                                    <span v-if="service.id === service_request.service_id">{{ service.name }}</span>
                                </template>
                            </div>
                            <div class="col">{{ service_request.date_of_request }}</div>
                            <div class="col">{{ service_request.service_status }}</div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
    `,
    data() {
        return {
            allServiceRequests: [],
            allServices: [],
            error: null,
            customer: {
                user_id: null
            },
            isWaiting: false
        };
    },
    methods: {
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
        },
    async mounted() {
        try {
            this.customer.user_id = localStorage.getItem('user_id');
            const res = await fetch('/api/request/service');
            const data = await res.json();

            if (res.ok) {
                this.allServiceRequests = data.service_requests;
                this.allServices = data.services;
            } else {
                this.error = 'Failed to load service requests.';
            }
        } catch (err) {
            console.error('Error fetching service requests:', err);
            this.error = 'An unexpected error occurred while loading data.';
        }
    }
};
