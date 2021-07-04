//** Order is Important

class QuoteStatus {
  quoteStatus = [];
  constructor(status, priority) {
    this.status = status;
    this.priority = priority;
    this.quoteStatus = Object.values(QuoteStatus);
  }
  getAllQuotesStatus = ()=>{
    const quoteStatus = [];
    for (let qState of Object.values(QUOTE_STATUS)) {
      quoteStatus.push(qState.status);
    }
    console.log(quoteStatus);
    return quoteStatus;
  }

   findQuoteByStatus = (name) =>{
      return this.quoteStatus.some(status => status.status == name);
  }

   checkQuotesStatusCanBeUpdated = (existingQuoteStatus,newQuoteStatus)=>{
      const existingQStatus = this.findQuoteByStatus(existingQuoteStatus);
      const newQStatus = this.findQuoteByStatus(existingQuoteStatus);
      if(newQStatus.priority >= existingQStatus.priority){
        return true;
      }
      return false;
  }

   get = (name) =>{
    const status = this.findQuoteByStatus(name);
    return status.name;
  }
}

const QUOTE_STATUS = {
  QUOTE_RECEIVED: new QuoteStatus("QUOTE_RECEIVED",1),
  QUOTE_IN_PROGRESS: new QuoteStatus("QUOTE_IN_PROGRESS",2),
  QUOTE_APPROVED: new QuoteStatus("QUOTE_APPROVED",3),
  CUSTOMER_QUOTE_ACCEPTED: new QuoteStatus("QUOTE_ACCEPTED",4),
  ADMIN_QUOTE_ACCEPTED: new QuoteStatus("ADMIN_QUOTE_ACCEPTED",5),
  PO_RECEIVED: new QuoteStatus("PO_RECEIVED",6),
  CLOSED: new QuoteStatus("CLOSED",7),
};


module.exports = {
  QuoteStatus: QuoteStatus
};
