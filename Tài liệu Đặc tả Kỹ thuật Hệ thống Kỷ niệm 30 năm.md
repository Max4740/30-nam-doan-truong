# **TÀI LIỆU ĐẶC TẢ KỸ THUẬT: HỆ THỐNG ĐIỂM DANH & KỶ YẾU SỐ SỰ KIỆN 30 NĂM ĐOÀN TRƯỜNG**

**1\. TỔNG QUAN DỰ ÁN (OVERVIEW)**

Dự án xây dựng một hệ thống Web-App nhẹ, hoạt động theo thời gian thực (real-time) nhằm phục vụ hai mục đích chính cho sự kiện Kỷ niệm 30 năm thành lập Đoàn trường:

* **Tự động hóa điểm danh:** Quét mã vạch thẻ sinh viên, trích xuất và hiển thị thông tin Đại biểu/Sinh viên lên màn hình phụ nhanh chóng, chính xác.  
* **Tương tác Kỷ yếu số:** Cho phép Đại biểu/Sinh viên ký tên trên Tablet, chữ ký lập tức được truyền và hiển thị ngẫu nhiên trên màn hình LED chính của sân khấu kèm hiệu ứng vinh danh.

**2\. KIẾN TRÚC HỆ THỐNG (ARCHITECTURE)**

Hệ thống sử dụng mô hình **Serverless (Không máy chủ cục bộ)** dựa trên nền tảng đám mây của **Firebase** để đảm bảo tính sẵn sàng cao, bảo mật và triển khai nhanh chóng (trong 48h).

* **Front-end (Giao diện người dùng):** HTML5, CSS3, Vanilla JavaScript (JS thuần, không dùng framework nặng như React/Angular để tối ưu tốc độ load).  
* **Back-end & Database:** Firebase Realtime Database (Lưu trữ và đồng bộ dữ liệu siêu tốc).  
* **Authentication:** Firebase Authentication (Bảo mật truy cập bằng Email/Password cho Ban tổ chức).  
* **Hosting:** Firebase Hosting (Cung cấp tên miền web.app miễn phí, hỗ trợ SSL/HTTPS).  
* **Mạng:** Yêu cầu các thiết bị (Máy tính điểm danh, Tablet, Máy tính chiếu LED) phải được kết nối vào một mạng Wi-Fi/4G nội bộ độc lập của BTC để đảm bảo ổn định.

**3\. MÔ TẢ CÁC MODULE CHỨC NĂNG (MODULES)**

Hệ thống được chia thành 3 màn hình giao diện chính (tương ứng với 3 file HTML):

**3.1. Module Điểm danh (Scanner & Display)**

* **Thiết bị:** Laptop kết nối với súng quét mã vạch (hoạt động như bàn phím ảo). Laptop này nối ra 1 màn hình phụ (TV/Monitor nhỏ).  
* **Hoạt động:**  
  1. Nhân sự BTC mở trang web diemdanh.html.  
  2. Hệ thống yêu cầu đăng nhập (Firebase Auth).  
  3. Giao diện hiển thị một ô input (luôn ở trạng thái focus ngầm).  
  4. Khi quét thẻ, súng quét nhập MSSV và tự động gửi phím Enter.  
  5. JavaScript bắt sự kiện Enter, lấy MSSV truy vấn vào Firebase Database.  
  6. **Kết quả:** Trả về màn hình phụ các thông tin: Tên, Khoa, Ngành, Số thứ tự check-in. Cập nhật trạng thái "Đã điểm danh" lên Database để xuất báo cáo sau sự kiện.

**3.2. Module Tablet Ký tên (Signature Pad)**

* **Thiết bị:** Tablet (iPad/Android) đặt tại quầy check-in.  
* **Hoạt động:**  
  1. Mở trang web kyten.html. Đăng nhập tài khoản BTC.  
  2. Giao diện hiển thị một vùng vẽ lớn sử dụng thẻ \<canvas\>. (Có thể dùng thư viện siêu nhẹ signature\_pad.js).  
  3. Người dùng ký tên.  
  4. Cung cấp 2 lựa chọn (Radio button hoặc Toggle): **"Đại biểu"** hoặc **"Sinh viên"** để phân loại kích thước hiển thị.  
  5. Nhấn nút "Gửi".  
  6. **Xử lý logic:** JavaScript chuyển đổi nét vẽ trên \<canvas\> thành một chuỗi dữ liệu hình ảnh (Base64) với nền trong suốt (Transparent PNG). Gửi chuỗi này cùng với cờ phân loại (Đại biểu/Sinh viên) lên nhánh signatures trên Firebase Database. Xóa trắng \<canvas\> để người tiếp theo ký.

**3.3. Module Màn hình LED (Live Wall)**

* **Thiết bị:** Laptop kết nối xuất hình ảnh ra màn hình LED lớn trên sân khấu.  
* **Hoạt động:**  
  1. Mở trang web led\_wall.html. Đăng nhập tài khoản BTC.  
  2. Trang web thiết lập kết nối "lắng nghe" (listener) vào nhánh signatures của Firebase.  
  3. **Xử lý logic khi có dữ liệu mới:**  
     * Nhận chuỗi Base64 từ Firebase.  
     * Tạo một thẻ \<img\> mới chứa chữ ký.  
     * Xác định kích thước hiển thị dựa trên cờ (Đại biểu to, Sinh viên nhỏ).  
     * Tính toán tọa độ (X, Y) ngẫu nhiên trên màn hình bằng Math.random(), đảm bảo ảnh không bị tràn viền.  
     * Thêm Class CSS để tạo hiệu ứng "Highlight" (ví dụ: phóng to nhẹ, chớp sáng viền) trong 2 giây đầu, sau đó hòa vào nền với các chữ ký cũ.  
     * Lưu trữ tạm các chữ ký đã tải vào localStorage của trình duyệt để đề phòng trường hợp mất điện/F5 tải lại trang không bị mất lịch sử.

**4\. CẤU TRÚC CƠ SỞ DỮ LIỆU (DATABASE STRUCTURE)**

Sử dụng JSON Tree của Firebase Realtime Database. Cấu trúc được làm phẳng (flattened) để tối ưu tốc độ đọc/ghi:

{  
  "students\_data": {  
    "MSSV\_2311001": {  
      "name": "Nguyễn Văn A",  
      "faculty": "Công nghệ Thông tin",  
      "role": "Sinh viên",  
      "checked\_in": true,  
      "timestamp": 1715000000  
    },  
    "MSSV\_2011005": {  
      "name": "Trần Thị B",  
      "faculty": "Kinh tế",  
      "role": "Đại biểu",  
      "checked\_in": false,  
      "timestamp": null  
    }  
  },  
  "signatures\_stream": {  
    "sig\_id\_001": {  
      "type": "vip", // Hoặc "normal"  
      "image\_base64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA...",  
      "timestamp": 1715000050  
    },  
    "sig\_id\_002": {  
      "type": "normal",  
      "image\_base64": "data:image/png;base64,R0lGODlhAQABAIAAAAAAAP...",  
      "timestamp": 1715000100  
    }  
  }  
}

**5\. LƯU Ý KỸ THUẬT QUAN TRỌNG (CRITICAL NOTES)**

* **Xử lý Base64:** Chuỗi Base64 của hình ảnh có thể khá dài. Firebase Realtime Database xử lý tốt việc này, nhưng để tránh lag mạng, cần thiết lập \<canvas\> trên Tablet ở độ phân giải vừa đủ nét (ví dụ: 800x400) thay vì quá lớn.  
* **Chống tràn bộ nhớ LED:** Nếu số lượng chữ ký quá lớn (vài trăm cái), việc nhồi nhét quá nhiều thẻ \<img\> độ phân giải cao có thể làm lag trình duyệt của máy chiếu LED. Giải pháp: Có thể giới hạn hiển thị (chỉ hiện 100 chữ ký gần nhất) hoặc vẽ đè thẳng lên một \<canvas\> tổng trên màn hình LED thay vì tạo nhiều thẻ \<img\>.  
* **Bảo mật rules:** Cần cấu hình Firebase Security Rules để chỉ cho phép các tác vụ Read/Write khi biến auth \!= null (nghĩa là đã đăng nhập thành công).  
* **Chuẩn bị dữ liệu:** File danh sách sinh viên ban đầu (Excel/CSV) cần được làm sạch (không có ký tự lạ, MSSV không có dấu cách) và chuyển đổi sẵn thành chuẩn JSON để Import một lần lên nhánh students\_data.