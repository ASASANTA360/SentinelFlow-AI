export async function documentAgent(data: any) {
  return {
    invoiceId: data.invoiceId,
    customer: data.customer,
    amount: data.amount,
    status: "parsed",
  };
}