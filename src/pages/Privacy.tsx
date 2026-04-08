import FadeIn from "@/components/FadeIn";
import SEO from "@/components/SEO";
import { useSettings } from "@/hooks/use-settings";
import { useContent } from "@/hooks/use-content";

const Privacy = () => {
  const { settings } = useSettings();
  const { content } = useContent();

  const companyName = settings?.companyName || "ООО «Авис»";
  const inn = settings?.inn || "";
  const ogrn = settings?.ogrn || "";
  const address = content?.contacts?.address || "";
  const email = content?.contacts?.email || import.meta.env.VITE_EMAIL || "info@example.com";
  const phone = content?.contacts?.phone || import.meta.env.VITE_PHONE || "+70000000000";
  const formattedPhone = phone.replace(/\+?(\d)(\d{3})(\d{3})(\d{2})(\d{2})/, "+$1 ($2) $3-$4-$5");

  const sections = [
    {
      title: "1. Общие положения",
      text: `Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных пользователей сайта ${companyName} (далее — Оператор). Оператор обеспечивает защиту персональных данных в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных».`,
    },
    {
      title: "2. Какие данные мы собираем",
      text: `При использовании сайта мы можем собирать следующие персональные данные:
• Номер телефона (при отправке заявки через форму обратной связи)
• Имя или название компании (при указании в форме, необязательное поле)
• Техническая информация: IP-адрес, тип браузера, время посещения (автоматически)`,
    },
    {
      title: "3. Цели обработки данных",
      text: `Персональные данные обрабатываются в следующих целях:
• Обработка входящих заявок и обратная связь с пользователем
• Предоставление информации о продукции и услугах компании
• Улучшение качества обслуживания и работы сайта`,
    },
    {
      title: "4. Порядок обработки данных",
      text: `Оператор обрабатывает персональные данные законным и справедливым образом. Данные из форм заявок передаются через защищённый канал связи. Оператор не передаёт персональные данные третьим лицам без согласия пользователя, за исключением случаев, предусмотренных законодательством Российской Федерации.`,
    },
    {
      title: "5. Защита данных",
      text: `Оператор принимает необходимые организационные и технические меры для защиты персональных данных от неправомерного доступа, уничтожения, изменения, блокирования, копирования и распространения.`,
    },
    {
      title: "6. Права пользователя",
      text: `Пользователь имеет право:
• Запросить информацию об обработке своих персональных данных
• Потребовать уточнения, блокирования или уничтожения персональных данных
• Отозвать согласие на обработку персональных данных

Для реализации указанных прав направьте запрос на электронную почту: ${email}`,
    },
    {
      title: "7. Файлы cookie",
      text: `Сайт может использовать файлы cookie для обеспечения корректной работы и улучшения пользовательского опыта. Пользователь может отключить использование cookie в настройках браузера.`,
    },
    {
      title: "8. Изменение политики",
      text: `Оператор оставляет за собой право вносить изменения в настоящую Политику конфиденциальности. Актуальная версия размещена на данной странице.`,
    },
    {
      title: "9. Контактная информация",
      text: [
        companyName,
        inn ? `ИНН: ${inn}` : "",
        ogrn ? `ОГРН: ${ogrn}` : "",
        address ? `Адрес: ${address}` : "",
        `Email: ${email}`,
        `Телефон: ${formattedPhone}`,
      ].filter(Boolean).join("\n"),
    },
  ];

  return (
    <div style={{ background: "#0d0f12", minHeight: "100vh" }}>
      <SEO
        title="Политика конфиденциальности | АВИС"
        description="Политика конфиденциальности и обработки персональных данных сайта АВИС."
        path="/privacy"
      />

      <div className="py-12 px-5 md:py-20 md:px-[6vw] max-w-[800px] mx-auto">
        <FadeIn>
          <span
            className="block uppercase"
            style={{ fontSize: 10, color: "#4a7fa5", letterSpacing: "0.15em" }}
          >
            Документ
          </span>
          <h1
            className="mt-2"
            style={{
              fontSize: "clamp(24px, 3vw, 36px)",
              fontWeight: 200,
              color: "#d4dae2",
              margin: 0,
              marginTop: 8,
              lineHeight: 1.2,
            }}
          >
            Политика конфиденциальности
          </h1>
        </FadeIn>

        <div className="mt-10 space-y-8">
          {sections.map((s, i) => (
            <FadeIn key={i} delay={i * 0.03}>
              <h2
                style={{
                  fontSize: 16,
                  fontWeight: 500,
                  color: "#c0cdd8",
                  margin: 0,
                  marginBottom: 8,
                }}
              >
                {s.title}
              </h2>
              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: "#6b7280",
                  margin: 0,
                  whiteSpace: "pre-line",
                }}
              >
                {s.text}
              </p>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Privacy;
