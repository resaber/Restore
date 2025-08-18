import { Paper } from "@mui/material";
import { useLocation } from "react-router-dom"

export default function ServerError() {

  //接收Router傳過來的 state
  const {state} = useLocation();
  return (
    // <div className="container mt-4" >
    //   <div className="card p-4 shadow-sm">
    //     <h5 className="mb-3">123</h5>  
    //   </div>  
    // </div>
    <Paper>
      {state?.error ? (
          <>
            <h3 className="text-secondary px-4 pt-2 mb-3">{state.error.title}</h3>
            <hr />
            <p className="px-4 py-2">{state.error.detail}</p>
          </>
        ) : (
          <h5 className="text-danger">Server error</h5>
        )}
    </Paper>
  )
}