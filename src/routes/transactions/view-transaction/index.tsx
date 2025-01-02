import { useNavigate, useParams } from "react-router-dom";
import { useTransactionDetails } from "./hooks/useTransactionDetails";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';


const TransactionDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: transaction, isLoading, error } = useTransactionDetails(id);
  
    if (isLoading) {
      return <div className="flex items-center justify-center h-96">Loading...</div>;
    }
  
    if (error || !transaction) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-red-500">Error loading transaction details.</div>
        </div>
      );
    }
    
  return (
     <div className="max-w-7xl mx-auto p-6">
          <Helmet>
            <title>Transaction Details - GRVL</title>
          </Helmet>
          
          <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate('/admin/transactions')} className="mb-4">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Transactions
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
          {/* Transaction Information */}
          <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Transaction Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div>
              <div className="font-medium">Payment Method</div>
              <div>
                {transaction.method}
              </div>
            </div>
            <div>
              <div className="font-medium">Payment Status</div>
              <div>{transaction.status}</div>
            </div>
            <div>
              <div className="font-medium">Transaction Reference/ ID</div>
              <div>{transaction.transactionId}</div>
            </div>
            <div>
              <div className="font-medium">Total Amount</div>
              <div>KES {parseInt(transaction.amount).toLocaleString()}</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
          </div>
  )
}

export default TransactionDetails