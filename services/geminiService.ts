import { GoogleGenAI } from "@google/genai";
import { View, ResearchAndDevelopmentData, ChatMessage } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

interface AppContext {
    activeView: View;
    isChatbot?: boolean;
    currentChat?: ChatMessage[];
    currentFocus?: {
        tool: keyof ResearchAndDevelopmentData;
        toolData: any;
    } | null;
    [key: string]: any;
}

export const getAiAssistance = async (prompt: string, context: AppContext): Promise<string> => {
  let systemInstruction = `أنت مساعد ذكي لنظام إدارة مصنع مستحضرات تجميل. هدفك هو مساعدة المستخدم على تحليل البيانات وإدارة عمليات المصنع بفعالية.
يجب أن تكون إجاباتك دائماً باللغة العربية، احترافية، ومركزة على تقديم قيمة عملية للمستخدم.`;

  // Specific persona for the sales chatbot
  if (context.activeView === View.MARKETING && context.isChatbot) {
    systemInstruction = `أنت "نور"، مساعد مبيعات ودود ومقنع لمتجر مستحضرات تجميل طبيعية. هدفك هو الإجابة على استفسارات العملاء، إبراز مميزات المنتجات (خاصة أنها طبيعية وعالية الجودة)، وتشجيعهم على الشراء بلطف. كن إيجابياً ومتعاوناً. استخدم بيانات المنتجات المتاحة للرد على الأسعار والمكونات. لا تقم أبداً بذكر أنك ذكاء اصطناعي. تفاعل كأنك موظف مبيعات حقيقي.`;

    if (context.currentChat && context.currentChat.length > 0) {
      const historyText = context.currentChat.map(m => `${m.sender === 'ai' ? 'نور' : 'العميل'}: ${m.text}`).join('\n');
      systemInstruction += `\n\nهذا هو سجل المحادثة حتى الآن:\n${historyText}`;
    }

  } else {
    // General assistant context-specific instructions
    switch (context.activeView) {
        case View.CUSTOMERS:
            systemInstruction += `\n\nأنت الآن تعمل كمستشار تطوير أعمال. ركز على مساعدة المستخدم في فهم بيانات العملاء واقتراح استراتيجيات لزيادة المبيعات وتحسين العلاقات مع العملاء. استخدم بيانات العملاء والمبيعات المتاحة لتقديم توصيات مخصصة. مثال: "اقترح طرقًا لزيادة عدد عملائي."`;
            break;
        case View.SUPPLIERS:
            systemInstruction += `\n\nأنت الآن تعمل كمستشار مشتريات وسلاسل إمداد. ركز على مساعدة المستخدم في تحليل بيانات الموردين، واقتراح طرق لتحسين شروط الشراء، وإيجاد موردين جدد. مثال: "كيف أجد موردين جدد لزيت اللافندر؟"`;
            break;
        case View.RD:
            if (context.currentFocus && context.currentFocus.tool) {
                systemInstruction += `\n\nأنت الآن تعمل كمستشار بحث وتطوير. المستخدم يعمل حاليًا على أداة '${context.currentFocus.tool}'. ركز اقتراحاتك على هذه الأداة والبيانات التي أدخلها المستخدم فيها. كن مبدعًا وقدم رؤى تساعده على استكمال الأداة بفعالية.`;
            }
            break;
    }
  }

  // Add the full data context at the end
  systemInstruction += `\n\nإليك الحالة الحالية لبيانات المصنع بصيغة JSON. استخدم هذه البيانات للإجابة على أسئلة المستخدم:
  ${JSON.stringify(context, null, 2)}`;


  try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
      });

      return response.text;
  } catch (error) {
      console.error("Error calling Gemini API:", error);
      if (error instanceof Error) {
          return `عذرًا، حدث خطأ أثناء الاتصال بالنموذج اللغوي: ${error.message}`;
      }
      return "عذرًا، حدث خطأ غير متوقع أثناء الاتصال بالنموذج اللغوي.";
  }
};