<template>
    <div>
        <center>
            <b-pagination
                :disabled="apiLoading"
                v-model="currentPage"
                :total-rows="rows"
                :per-page="perPage"
                aria-controls="my-table"
                first-number
                last-number
                @change="getItemsData"
            ></b-pagination>
        </center>

        <p class="mt-3">Current Page: {{ currentPage }}</p>

        <b-table
            :busy="apiLoading"
            :current-page="currentPage"
            :per-page="perPage"
            id="my-table"
            :items="items"
            :fields="fields"
            small
            striped
            hover
        >
            <template #cell(category)="item">
                {{
                    item &&
                    item.item &&
                    item.item.category &&
                    item.item.category.join(',')
                }}
            </template>
            <template #cell(taxful_total_price)="item">
                {{
                    item &&
                    item.item &&
                    item.item.taxful_total_price &&
                    item.item.currency &&
                    `${item.item.taxful_total_price} ${item.item.currency}`
                }}
            </template>
            <template #table-busy>
                <div class="text-center text-danger my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>Loading...</strong>
                </div>
            </template>
        </b-table>
    </div>
</template>

<script>
import axios from './api';
export default {
    data: () => ({
        perPage: 10,
        items: [],
        currentPage: 1,
        rows: 100,
        size: 10,
        search: {},
        apiLoading: false,
        fields: [
            {
                key: 'category',
                sortable: false,
            },
            {
                key: 'customer_full_name',
                sortable: false,
            },
            {
                key: 'order_date',
                sortable: true,
            },
            {
                key: 'taxful_total_price',
                sortable: true,
            },
        ],
    }),
    methods: {
        async getItemsData() {
            this.apiLoading = true;
            setTimeout(async () => {
                try {
                    const size = this.currentPage * this.size;
                    console.log(
                        'this.items.length',
                        this.items.length,
                        size,
                        this.items.length > size,
                    );
                    if (this.items.length && this.items.length >= size) {
                        return;
                    }
                    const payload = {
                        size: this.size,
                        from: this.currentPage * this.size,
                        search: this.search,
                    };
                    const { data } = await axios.post('data', payload);
                    this.items = [...this.items, ...data.data.data];
                    this.rows = data.data.totalData;
                } catch (error) {
                    alert(error.toString() || 'server error');
                } finally {
                    this.apiLoading = false;
                }
            }, 0);
        },
    },
    async mounted() {
        await this.getItemsData({});
    },
};
</script>
