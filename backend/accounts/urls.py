from django.urls import path
from .views import SendOTP, VerifyOTP, UserProfileView, UserAddressView ,AdminLogin



urlpatterns = [
    path("send-otp/", SendOTP.as_view(), name="send-otp"),
    path("verify-otp/", VerifyOTP.as_view(), name="verify-otp"),
    path("profile/", UserProfileView.as_view()),
    path("admin-login/", AdminLogin.as_view(), name="admin-login"),
    path("addresses/", UserAddressView.as_view()),
    path("addresses/<int:pk>/", UserAddressView.as_view()),
]
