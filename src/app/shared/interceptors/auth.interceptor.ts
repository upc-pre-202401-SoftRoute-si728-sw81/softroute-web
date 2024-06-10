import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authToken =
    'eyJhbGciOiJIUzI1NiJ9.eyJjb21wYW55SWQiOiJhMWU0YThhOC0xZTliLTRmOGMtOGM4ZS0xMjM0NTY3ODkwMDAiLCJpZCI6ImIwMDRhOGE4LTFlOWItNGY4Yy04YzhlLTEyMzQ1Njc4OTAwMCIsInN1YiI6ImRpZWdvZGVsYWNydXpAZ21haWwuY29tIiwiaWF0IjoxNzE3ODg5NjM5LCJleHAiOjE3MTg0OTQ0Mzl9.vMLfOzdV8sQNZy96_VMtEVgLf_OneRmuaFyEmTqvV_g';
  // Clone the rneRmuaFyEmTqvV_gequest and add the authorization header
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  // Pass the cloned request with the updated header to the next handler
  return next(authReq).pipe(
    catchError((err: any) => {
      if (err instanceof HttpErrorResponse) {
        // Handle HTTP errors
        if (err.status === 401) {
          // Specific handling for unauthorized errors
          console.error('Unauthorized request:', err);
          // You might trigger a re-authentication flow or redirect the user here
        } else {
          // Handle other HTTP error codes
          console.error('HTTP error:', err);
        }
      } else {
        // Handle non-HTTP errors
        console.error('An error occurred:', err);
      }

      // Re-throw the error to propagate it further
      return throwError(() => err);
    })
  );
};
