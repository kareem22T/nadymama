import { useEffect, useState } from "react";
import DefaultLayout from "../../layout/DefaultLayout";
import axios from "axios";
type SettingsRes = {
    about: string,
    ad_user_one: string,
    ad_user_two: string
  }
  interface Settings {
    id: number;
    data: SettingsRes;
  }
  
const About = () => {
    const [settings, setSettings] = useState<SettingsRes>();

    const fetchSettings = async (): Promise<SettingsRes> => {
        const response = await axios.get<Settings>('https://nadymama-api.ykdev.online/api/users/settings');
        return response.data.data;
    };
  
    useEffect(() => {
      const getSettings = async () => {
          try {
              const data = await fetchSettings();
              setSettings(data);
          } catch (error) {
              console.error('Error fetching the Articles:', error);
          }
      };
      getSettings();
    }, [])
    return (
        <DefaultLayout>
                <section className="doctor">
                    <div className="container">
                        <div className="card_wrapper" style={{fontSize: "22px", marginBottom: "100px"}}>
                            {settings?.about}
                        </div>
                    </div>
                </section>

                <section className="ad">
                    <div className="container">
                        <div className="img">
                        <img src={"https://nadymama-api.ykdev.online/public/storage/" + settings?.ad_user_one} alt="Advertisement" />
                        </div>
                    </div>
                </section>

                <section className="ad">
                    <div className="container">
                        <div className="img">
                            <img src={"https://nadymama-api.ykdev.online/public/storage/" + settings?.ad_user_two} alt="Advertisement" />
                        </div>
                    </div>
                </section>
        </DefaultLayout>
    )
}

export default About;