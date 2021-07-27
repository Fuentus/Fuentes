//** Order is Important

class QuoteStatus {
    static quoteStatus = [];

    constructor(status, priority) {
        this.status = status;
        this.priority = priority;
    }

    static defaultValue = () => {
        return QUOTE_STATUS.QUOTE_NEW.status;
    }
    static adminAcceptedQuote = () => {
        return QUOTE_STATUS.QUOTE_ADMIN_ACCEPTED.status;
    }

    static getAllQuotesStatus = () => {
        if (this.quoteStatus != null && this.quoteStatus.length > 0) {
            return this.quoteStatus;
        }
        for (let qState of Object.values(QUOTE_STATUS)) {
            this.quoteStatus.push(qState.status);
        }
        return this.quoteStatus;
    }
    static customerStatus = () => {
        const res = [];
        res.push(QUOTE_STATUS.QUOTE_NEW.status);
        res.push(QUOTE_STATUS.QUOTE_ACCEPTED.status);
        res.push(QUOTE_STATUS.QUOTE_SUBMIT.status);
        res.push(QUOTE_STATUS.QUOTE_REJECTED.status);
        return res;
    }
    static findQuoteByStatus = (name) => {
        for (let key of Object.keys(QUOTE_STATUS)) {
            if (QUOTE_STATUS[key].status === name.toUpperCase()) {
                return QUOTE_STATUS[key];
            }
        }
    }

    static checkQuotesStatusCanBeUpdated = (existingQuoteStatus, newQuoteStatus) => {
        const existingQStatus = this.findQuoteByStatus(existingQuoteStatus);
        const newQStatus = this.findQuoteByStatus(newQuoteStatus);
        if (!newQStatus) {
            return false;
        }
        return newQStatus.priority >= existingQStatus.priority;
    }

    static get = (name) => {
        const status = this.findQuoteByStatus(name);
        return status.name;
    }
}

const QUOTE_STATUS = {
    //Customer
    QUOTE_NEW: new QuoteStatus("NEW", 1),
    //ADMIN
    QUOTE_IN_PROGRESS: new QuoteStatus("WIP", 2),
    QUOTE_RECEIVED: new QuoteStatus("QUOTE_RECEIVED", 3),
    //CUSTOMER
    QUOTE_ACCEPTED: new QuoteStatus("QUOTE_ACCEPTED", 4),
    QUOTE_SUBMIT: new QuoteStatus("QUOTE_PO_SUBMIT", 5),
    //Priority will reset to QUOTE_IN_PROGRESS
    QUOTE_REJECTED: new QuoteStatus("QUOTE_REJECTED", 4),
    //ADMIN
    QUOTE_ADMIN_ACCEPTED: new QuoteStatus("PROJECT_IN_PROGRESS", 6),
    //Priority will reset to 5 (QUOTE_PO_SUBMITTED)
    QUOTE_ADMIN_REJECTED: new QuoteStatus("QUOTE_ADMIN_REJECT", 6),
    CLOSED: new QuoteStatus("CLOSED", 7)
};


module.exports = {
    QuoteStatus: QuoteStatus
};
