package com.hostelmanager.app.api;

import com.hostelmanager.app.models.*;
import com.hostelmanager.app.api.responses.*;
import com.hostelmanager.app.api.requests.*;

import java.util.List;
import java.util.Map;

import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import retrofit2.Call;
import retrofit2.http.*;

public interface ApiInterface {
    
    // Authentication
    @POST("api/login")
    Call<LoginResponse> login(@Body LoginRequest request);
    
    @POST("api/register")
    Call<LoginResponse> register(@Body RegisterRequest request);
    
    // Room Management
    @GET("api/rooms")
    Call<List<Room>> getRooms(@Header("Authorization") String token);
    
    @GET("api/my-room")
    Call<RoomResponse> getMyRoom(@Header("Authorization") String token);
    
    @POST("api/rooms")
    Call<ApiResponse> createRoom(@Header("Authorization") String token, @Body Room room);
    
    @PUT("api/rooms/{roomNumber}/assign/{studentId}")
    Call<ApiResponse> assignRoom(@Header("Authorization") String token, 
                                 @Path("roomNumber") String roomNumber, 
                                 @Path("studentId") String studentId);
    
    // Student Management
    @GET("api/students")
    Call<List<User>> getStudents(@Header("Authorization") String token);
    
    @DELETE("api/students/{studentId}")
    Call<ApiResponse> deleteStudent(@Header("Authorization") String token, 
                                    @Path("studentId") String studentId);
    
    // Complaints
    @GET("api/complaints")
    Call<List<Complaint>> getComplaints(@Header("Authorization") String token);
    
    @POST("api/complaints")
    Call<ApiResponse> createComplaint(@Header("Authorization") String token, 
                                      @Body ComplaintRequest request);
    
    @PUT("api/complaints/{complaintId}/status")
    Call<ApiResponse> updateComplaintStatus(@Header("Authorization") String token,
                                            @Path("complaintId") String complaintId,
                                            @Body Map<String, String> status);
    
    // Payments
    @GET("api/payments")
    Call<List<Payment>> getPayments(@Header("Authorization") String token);
    
    @POST("api/payments")
    Call<ApiResponse> createPayment(@Header("Authorization") String token, 
                                    @Body Payment payment);
    
    @PUT("api/payments/{paymentId}/mark-paid")
    Call<ApiResponse> markPaymentPaid(@Header("Authorization") String token,
                                      @Path("paymentId") String paymentId);
    
    // Mess Menu
    @GET("api/mess-menu")
    Call<List<MessMenu>> getMessMenu(@Header("Authorization") String token);
    
    @POST("api/mess-menu")
    Call<ApiResponse> createMessMenu(@Header("Authorization") String token, 
                                     @Body MessMenu menu);
    
    @DELETE("api/mess-menu/{menuId}")
    Call<ApiResponse> deleteMessMenu(@Header("Authorization") String token,
                                     @Path("menuId") String menuId);
    
    // Renewal Forms
    @GET("api/renewal-forms")
    Call<List<RenewalForm>> getRenewalForms(@Header("Authorization") String token);
    
    @POST("api/renewal-forms")
    Call<ApiResponse> createRenewalForm(@Header("Authorization") String token, 
                                        @Body RenewalFormRequest request);
    
    @GET("api/renewal-forms/{formId}")
    Call<RenewalForm> getRenewalForm(@Header("Authorization") String token,
                                     @Path("formId") String formId);
    
    @PUT("api/renewal-forms/{formId}")
    Call<ApiResponse> updateRenewalForm(@Header("Authorization") String token,
                                        @Path("formId") String formId,
                                        @Body RenewalFormUpdateRequest request);
    
    @PUT("api/renewal-forms/{formId}/files")
    Call<ApiResponse> updateRenewalFormFiles(@Header("Authorization") String token,
                                             @Path("formId") String formId,
                                             @Body Map<String, String> files);
    
    @DELETE("api/renewal-forms/{formId}")
    Call<ApiResponse> deleteRenewalForm(@Header("Authorization") String token,
                                        @Path("formId") String formId);
    
    // File Upload
    @Multipart
    @POST("api/upload-file")
    Call<FileUploadResponse> uploadFile(@Header("Authorization") String token,
                                        @Part MultipartBody.Part file,
                                        @Part("file_type") RequestBody fileType);
    
    // File Download
    @GET("api/download-file/{userId}/{filename}")
    Call<okhttp3.ResponseBody> downloadFile(@Header("Authorization") String token,
                                            @Path("userId") String userId,
                                            @Path("filename") String filename);
}
