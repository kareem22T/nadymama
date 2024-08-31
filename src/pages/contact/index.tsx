import { useEffect, useState } from "react";
import DefaultLayout from "../../layout/DefaultLayout";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

type SettingsRes = {
  about: string;
  ad_user_one: string;
  ad_user_two: string;
};

interface Settings {
  id: number;
  data: SettingsRes;
}

const Contact = () => {
  const [settings, setSettings] = useState<SettingsRes>();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const fetchSettings = async (): Promise<SettingsRes> => {
    const response = await axios.get<Settings>("https://nadymama-api.ykdev.online/api/users/settings");
    return response.data.data;
  };

  useEffect(() => {
    const getSettings = async () => {
      try {
        const data = await fetchSettings();
        setSettings(data);
      } catch (error) {
        console.error("Error fetching the settings:", error);
      }
    };
    getSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !email || !phone || !message) {
      setError("Please fill out all fields.");
      return;
    }

    try {
      await axios.post("https://nadymama-api.ykdev.online/api/users/messages", {
        name,
        email,
        phone,
        message,
      });

      // Reset form fields after successful submission
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setError(""); // Clear any existing error
      toast.success('تم ارسال رسالتك بنجاح سوف نتواصل معك!')
    } catch (error) {
      console.error("Error submitting the message:", error);
      setError("Failed to send the message. Please try again.");
    }
  };

  return (
    <DefaultLayout>
      <section className="doctor">
        <div className="container">
          <div className="card_wrapper" style={{ fontSize: "22px", marginBottom: "100px" }}>
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <h1>تواصل معنا</h1>
              <p>نتشرف باستقبال رسايلكم</p>
              <br />
              {error && <p style={{ color: "red" }}>{error}</p>}
              <div className="input-group" style={{ width: "100%" }}>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="الاسم"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="input-group" style={{ width: "100%" }}>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="البريد"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input-group" style={{ width: "100%" }}>
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  placeholder="الهاتف"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="input-group" style={{ width: "100%" }}>
                <textarea
                  name="message"
                  id="message"
                  placeholder="الرسالة"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                ></textarea>
              </div>
              <button className="submit-btn">ارسال</button>
            </form>
          </div>
        </div>
      </section>

      <section className="ad">
        <div className="container">
          <div className="img">
            <img
              src={"https://nadymama-api.ykdev.online/public/storage/" + settings?.ad_user_one}
              alt="Advertisement"
            />
          </div>
        </div>
      </section>

      <section className="ad">
        <div className="container">
          <div className="img">
            <img
              src={"https://nadymama-api.ykdev.online/public/storage/" + settings?.ad_user_two}
              alt="Advertisement"
            />
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
};

export default Contact;
