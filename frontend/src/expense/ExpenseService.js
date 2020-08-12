import axios from 'axios';

const API_URL = 'http://localhost:8080';

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true

export default class ExpenseService {
    constructor() {
    }

    getExpenseDetail() {
        const url = '';
        return axios.get(url).then(response => response.data);
    }

    getPaymentHistory() {
        const url = '/expense/payments/';
        return axios.get(url).then(response => response.data);
    }

    newExpense(expense, groupId) {
        const url = '/expense/' + groupId + '/new/';
        return axios.post(url, expense, groupId)
    }

    getUserExpenses() {
        return axios.get("/expense").then(response => response.data);
    }

    expensePayment(expense, expenseId) {
        const url = '/expense/' + expenseId + '/pay/';
        return axios.post(url, expense, expenseId)
    }

    deleteExpense(expenseId) {
        const url = '/expense/' + expenseId + '/delete/';
        return axios.delete(url, expenseId)
    }

    getUserOwingExpense() {
        return axios.get("/expense/owing/").then(response => response.data);
    }

    getUserOwedExpense() {
        return axios.get("/expense/owed/").then(response => response.data);
    }

    getPayAnonLinkDetails(id) {
        return axios.get(`/expense/pay/${id}`).then(response => response.data)
    }

    payAnonAonLink(email, amount, anon_link) {
        return axios.post(`/expense/pay/${anon_link}`, {
            amount: amount,
            email: email
        })
    }
}