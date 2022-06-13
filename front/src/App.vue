<template>
    <div class="ml-5 mr-5">
        <b-form>
            Gender
            <b-form-select
                class="mb-2"
                v-model="customer_gender"
                :options="genderOptions"
            />
            Per Page Records
            <b-form-select class="mb-2" v-model="size" :options="sizeOptions" />
            From Date
            <b-form-datepicker
                class="mb-2"
                v-model="dateFrom"
            ></b-form-datepicker>
            To Date
            <b-form-datepicker
                class="mb-2"
                v-model="dateTo"
            ></b-form-datepicker>
            <b-button @click="getItemsData" class="mb-2 mt-2" variant="primary">
                Apply Filter
            </b-button>
        </b-form>
        <div class="table">
            <b-table
                sticky-header
                :busy="apiLoading"
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

        <p class="mt-3">Current Page: {{ currentPage }}</p>
        <p class="mt-3">Total Records: {{ rows }}</p>
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
        customer_gender: null,
        dateFrom: null,
        fields: [
            {
                key: 'number',
                sortable: false,
            },
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
                sortable: !true,
            },
            {
                key: 'taxful_total_price',
                sortable: !true,
            },
            {
                key: 'customer_gender',
                sortable: false,
            },
        ],
        genderOptions: [
            { value: null, text: 'Select Gender' },
            { value: 'FEMALE', text: 'FEMALE' },
            { value: 'MALE', text: 'MALE' },
        ],
        sizeOptions: [
            { value: 10, text: 10 },
            { value: 50, text: 50 },
            { value: 100, text: 100 },
            { value: 500, text: 500 },
        ],
    }),
    methods: {
        async getItemsData() {
            this.apiLoading = true;
            console.log(this.dateFrom);
            setTimeout(async () => {
                try {
                    this.search = {};
                    const arr = ['customer_gender', 'dateFrom', 'dateTo'];
                    const start = 0;
                    const end = arr.length;
                    for (let i = start; i < end; i += 1) {
                        if (this[arr[i]]) {
                            this.search[arr[i]] = this[arr[i]];
                        }
                    }
                    const payload = {
                        size: this.size,
                        from: this.currentPage * this.size,
                        search: this.search,
                    };
                    const { data } = await axios.post('data', payload);
                    data.data.data = data?.data?.data?.map?.((_data, index) => {
                        return {
                            ..._data,
                            number: index + 1,
                        };
                    });
                    this.items = [...data.data.data];
                    this.rows = data.data.totalData;
                    this.perPage = this.size;
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
