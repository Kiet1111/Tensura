import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Initialize Gemini API client lazily / safely
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

// System Instruction for the Tensura Game Master & World Voice System
const GM_SYSTEM_INSTRUCTION = `Bạn là Game Master (GM) kiêm "Giọng nói Thế giới" (World Language System) điều hành tựa game Text-based RPG lấy cảm hứng từ Tensura Slime (Tiếng Việt).

QUY TẮC DẪN CHUYỆN & THẾ GIỚI TENSURA:
1. Phong cách nhập vai Tensura Slime sống động, huyền ảo, kịch tính:
   - Người chơi là một KẺ CHUYỂN SINH (Otherworlder / Reincarnator) tái sinh vào thế giới Tensura với chủng tộc và Kỹ Năng Độc Nhất của riêng mình.
   - Bối cảnh: Rừng Lớn Jura, Hang Động Phong Ấn, làng Goblin, quỷ nhân Kijin (Benimaru, Shion...), bộ tộc Nanh Sói Ranga, Thảm họa Orc Disaster, Bão Bùng Long Veldora, Rimuru Tempest, Thập Đại Ma Vương (Milim, Guy Crimson, Clayman...), Vương quốc Người Lùn Dwargon, Thánh Quốc Ruberios.
   - Khi người chơi thực hiện hành động (Săn quái, Thôn phệ/Nuốt chửng, Khai thác quặng/thảo dược, Dùng Kỹ năng Độc nhất, Xây dựng Lãnh địa, Tương tác với nhân vật Tensura), hãy mô tả diễn biến thỏa đáng và kịch tính.

2. HỆ THỐNG CỐT TRUYỆN HÀNH TRÌNH TENSURA:
   - Người chơi cùng tồn tại và phát triển trong thế giới Tensura, tham gia vào các sự kiện và cuộc phiêu lưu lớn.
   - Khi người chơi tương tác với các nhân vật quen thuộc (Rimuru, Veldora, Milim, Hinata, Diablo...) hoặc tham gia các sự kiện lớn, hãy trả về 'storyUpdate' chứa:
     + 'currentArc': tên chương hiện tại nếu có tiến triển
     + 'arcProgress': tiến độ chương (0-100)
     + 'relationChanges': cập nhật mức độ thiện cảm / quan hệ đối với nhân vật
     + 'milestoneUnlocked': cập nhật mốc cốt truyện
     + 'canonChangeDescription': mô tả ngắn gọn dấu ấn hành trình của người chơi.

3. GIỌNG NÓI THẾ GIỚI (WORLD VOICE):
   - Khi có hành động đặc biệt (chịu sát thương/nhiệt/băng/độc, ăn cây thuốc Hipokute, nuốt chửng ma vật, kích hoạt kỹ năng, tiến hóa, tương tác ma lượng), hệ thống PHẢI phát thông báo Giọng nói Thế giới.
   - Định dạng thông báo trong mảng worldVoiceAnnouncements:
     "░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░\\n[GIỌNG NÓI THẾ GIỚI]: Đã xác nhận... Nhận được [Tên Kỹ Năng / Kỹ Năng Kháng]!\\n░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░"

4. NẾU THÔN PHỆ (DEVOUR / PREDATOR):
   - Nếu quái vật yếu máu (<30% HP) hoặc bị đánh bại, người chơi dùng Thôn Phệ sẽ nuốt chửng ma vật và phân tích kỹ năng/thuộc tính của nó.

Hãy trả về phản hồi theo đúng cấu trúc JSON đã được quy định.`;

app.post("/api/game/turn", async (req, res) => {
  try {
    const { character, action, currentEnemy, location, storyState } = req.body;

    if (!character) {
      return res.status(400).json({ error: "Thiếu thông tin nhân vật" });
    }

    // Prepare prompt context
    const userPrompt = `
[THÔNG TIN NHÂN VẬT]:
- Tên: ${character.name}
- Chủng tộc: ${character.race} (${character.raceTitle})
- HP: ${character.hp}/${character.maxHp} | MP/Ma Lượng: ${character.mp}/${character.maxMp}
- Kỹ năng Độc nhất: ${character.skills.find((s: any) => s.category === 'Unique')?.name || 'Chưa rõ'} - ${character.skills.find((s: any) => s.category === 'Unique')?.description || ''}
- Các Kỹ năng khác: ${character.skills.map((s: any) => `[${s.name}]`).join(', ')}
- Lãnh địa: ${character.territory.name} (Cấp ${character.territory.level} - ${character.territory.levelTitle}, Dân số: ${character.territory.population})
- Vị trí hiện tại: ${location || 'Rừng Lớn Jura'}
- Kẻ thù hiện tại: ${currentEnemy ? `${currentEnemy.name} (HP: ${currentEnemy.hp}/${currentEnemy.maxHp})` : 'Không có (Hòa bình)'}

[TRẠNG THÁI CỐT TRUYỆN HÀNH TRÌNH TENSURA]:
- Chương hiện tại: ${storyState?.currentArc || 'Chương 1: Hang Động Phong Ấn & Long Vương Veldora'}
- Quan hệ nhân vật: ${storyState?.relations?.map((r: any) => `${r.name} (${r.status} - ${r.affinity}%)`).join(', ') || 'Chưa cập nhật'}

[HÀNH ĐỘNG CỦA NGƯỜI CHƠI]: "${action}"

Hãy phản hồi theo JSON schema. GM hãy sáng tạo câu chuyện kịch tính, phù hợp với phong cách nhập vai thế giới Tensura!
`;

    if (ai) {
      const candidateModels = ["gemini-3.6-flash", "gemini-flash-latest", "gemini-3.1-flash-lite", "gemini-3.1-pro-preview"];
      const responseSchemaConfig = {
        systemInstruction: GM_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            narrative: {
              type: Type.STRING,
              description: "Lời dẫn chuyện sinh động từ GM bằng Tiếng Việt.",
            },
            worldVoiceAnnouncements: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Các thông báo Giọng nói Thế giới nếu có.",
            },
            newSkills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  category: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ["id", "name", "category", "description"],
              },
            },
            newResistances: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  category: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ["id", "name", "category", "description"],
              },
            },
            hpChange: { type: Type.INTEGER },
            mpChange: { type: Type.INTEGER },
            itemsGained: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  quantity: { type: Type.INTEGER },
                  description: { type: Type.STRING },
                  type: { type: Type.STRING },
                },
                required: ["id", "name", "quantity", "description", "type"],
              },
            },
            territoryChanges: {
              type: Type.OBJECT,
              properties: {
                levelIncrease: { type: Type.INTEGER },
                newBuildings: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                populationIncrease: { type: Type.INTEGER },
                prosperityChange: { type: Type.INTEGER },
              },
            },
            combatEnemy: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                hp: { type: Type.INTEGER },
                maxHp: { type: Type.INTEGER },
                level: { type: Type.INTEGER },
                description: { type: Type.STRING },
                skills: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                isWeakened: { type: Type.BOOLEAN },
                dropItems: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ["id", "name", "hp", "maxHp", "level", "description"],
            },
            locationUpdate: { type: Type.STRING },
            suggestedActions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            isDevourSuccess: { type: Type.BOOLEAN },
            storyUpdate: {
              type: Type.OBJECT,
              properties: {
                currentArc: { type: Type.STRING },
                arcProgress: { type: Type.INTEGER },
                divergenceChange: { type: Type.INTEGER },
                divergenceTotal: { type: Type.INTEGER },
                variableTitle: { type: Type.STRING },
                milestoneUnlocked: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    arc: { type: Type.STRING },
                    title: { type: Type.STRING },
                    status: { type: Type.STRING },
                    playerImpact: { type: Type.STRING },
                  },
                },
                relationChanges: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      affinityChange: { type: Type.INTEGER },
                      newStatus: { type: Type.STRING },
                      notes: { type: Type.STRING },
                    },
                  },
                },
                canonChangeDescription: { type: Type.STRING },
              },
            },
          },
          required: ["narrative", "worldVoiceAnnouncements", "suggestedActions"],
        },
      };

      for (const model of candidateModels) {
        let attempts = 0;
        const maxAttempts = 2;

        while (attempts < maxAttempts) {
          try {
            attempts++;
            const response = await ai.models.generateContent({
              model,
              contents: userPrompt,
              config: responseSchemaConfig,
            });

            if (response?.text) {
              const parsedData = JSON.parse(response.text);
              return res.json(parsedData);
            }
          } catch (geminiError: any) {
            const errStr = String(geminiError?.message || geminiError);
            const isQuotaOrRateLimit =
              errStr.includes("429") ||
              errStr.includes("RESOURCE_EXHAUSTED") ||
              errStr.includes("Quota") ||
              errStr.includes("quota");

            const isTransient =
              errStr.includes("503") ||
              errStr.includes("UNAVAILABLE") ||
              errStr.includes("high demand");

            if (isQuotaOrRateLimit) {
              console.info(`[Gemini API] Quota or rate limit reached on model '${model}'. Switching to next available model...`);
              break; // Immediately switch to next candidate model
            } else if (isTransient && attempts < maxAttempts) {
              console.info(`[Gemini API] Transient 503 response on '${model}' (attempt ${attempts}/${maxAttempts}). Retrying in 500ms...`);
              await new Promise((resolve) => setTimeout(resolve, 500));
            } else {
              console.info(`[Gemini API] Notice on model '${model}', switching candidate...`);
              break; // Switch to next candidate model
            }
          }
        }
      }
      console.log("[Gemini API] All AI model candidates exhausted or rate-limited. Serving seamless response via Local Game Master.");
    }

    // Local GM Fallback logic if Gemini is loading or missing key
    const fallbackResponse = generateLocalGMResponse(character, action, currentEnemy, location);
    return res.json(fallbackResponse);
  } catch (error) {
    console.error("Error processing game turn:", error);
    const safeFallback = generateLocalGMResponse(
      req.body?.character || { name: 'Người Chuyển Sinh', race: 'Slime', skills: [], territory: { level: 1 } },
      req.body?.action || 'Hành động',
      req.body?.currentEnemy,
      req.body?.location
    );
    return res.json(safeFallback);
  }
});

// Error handling middleware (e.g. for body-parser or payload issues)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err) {
    console.error("[Server Error]", err);
    if (err.type === "entity.too.large" || err.status === 413) {
      const safeFallback = generateLocalGMResponse(
        { name: 'Người Chuyển Sinh', race: 'Slime', skills: [], territory: { level: 1 } },
        'Hành động',
        null,
        'Rừng Lớn Jura'
      );
      return res.json(safeFallback);
    }
    return res.status(err.status || 500).json({ error: err.message || "Lỗi máy chủ nội bộ" });
  }
  next();
});

// Local procedural rule engine for instant response & seamless fallback
function generateLocalGMResponse(character: any, action: string, currentEnemy: any, location: string) {
  const actLower = action.toLowerCase();
  let narrative = "";
  let worldVoiceAnnouncements: string[] = [];
  let newSkills: any[] = [];
  let newResistances: any[] = [];
  let hpChange = 0;
  let mpChange = -5;
  let itemsGained: any[] = [];
  let territoryChanges: any = null;
  let nextEnemy: any = currentEnemy;
  let suggestedActions: string[] = [];
  let newLocation = location || "Rừng Lớn Jura";
  let isDevourSuccess = false;

  // Case 1: Devour / Thôn phệ
  if (actLower.includes("thôn phệ") || actLower.includes("nuốt") || actLower.includes("predator")) {
    if (currentEnemy) {
      isDevourSuccess = true;
      narrative = `Bạn kích hoạt cơ chế Thôn Phệ! Lớp ma lực bao bọc lấy ${currentEnemy.name}, kéo chìm kẻ thù vào bên trong Dạ Dày. Quá trình phân tích và tái cấu trúc năng lượng bắt đầu ngay lập tức!`;
      
      const skillName = `Tơ Bạc Chí Mạng [${currentEnemy.name.split(' ')[0]}]`;
      const skillId = `skill_${Date.now()}`;
      newSkills.push({
        id: skillId,
        name: skillName,
        category: "Extra",
        description: `Kỹ năng học được sau khi thôn phệ ${currentEnemy.name}. Tăng tốc độ phản xạ và sát thương độc.`
      });

      worldVoiceAnnouncements.push(
        `░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░\n[GIỌNG NÓI THẾ GIỚI]: Đã xác nhận... Phân tích ${currentEnemy.name} thành công. Nhận được Kỹ năng Đặc biệt [${skillName}] và Ma Lượng phong phú!\n░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░`
      );

      itemsGained.push({
        id: `item_${Date.now()}`,
        name: `Ma Thạch ${currentEnemy.name}`,
        quantity: 1,
        description: `Tinh thể ma lực đậm đặc tinh chế từ ${currentEnemy.name}.`,
        type: "MonsterPart"
      });

      hpChange = 30;
      mpChange = 50;
      nextEnemy = null;

      suggestedActions = [
        "Đi khai thác thảo dược Hipokute",
        "Trở về nâng cấp Lãnh địa",
        "Khám phá sâu hơn vào Rừng Lớn Jura",
        "Sử dụng Kỹ năng Độc nhất để hợp nhất vật phẩm"
      ];
    } else {
      narrative = `Bạn mở rộng phạm vi Ma lực, kích hoạt Kỹ năng Độc nhất hấp thu nguồn năng lượng xung quanh. Ma lượng trong môi trường hội tụ vào cơ thể bạn.`;
      mpChange = 20;
      suggestedActions = [
        "Đi săn ma vật nguy hiểm",
        "Hái Cỏ Hipokute chế thuốc",
        "Mở rộng lãnh địa làng",
        "Kiểm tra Bảng trạng thái"
      ];
    }
  } 
  // Case 2: Hunt monsters / Săn quái
  else if (actLower.includes("săn") || actLower.includes("quái") || actLower.includes("đánh") || actLower.includes("tấn công")) {
    if (!currentEnemy) {
      const monsterTypes = [
        { name: "Sói Quỷ Độc Nhãn (Evil Wolf)", hp: 80, level: 3, drops: "Da Sói Quỷ, Nanh Sói" },
        { name: "Nhện Ma Bọc Băng (Ice Spider)", hp: 110, level: 5, drops: "Tơ Băng Bạc, Ma Thạch" },
        { name: "Thằn Lằn Tráp Đỏ (Flame Lizard)", hp: 140, level: 7, drops: "Vảy Rồng Lửa, Độc Tố" }
      ];
      const selected = monsterTypes[Math.floor(Math.random() * monsterTypes.length)];

      nextEnemy = {
        id: `enemy_${Date.now()}`,
        name: selected.name,
        hp: selected.hp,
        maxHp: selected.hp,
        level: selected.level,
        description: `Một ma vật hung tợn ẩn nấp trong lùm cây Jura, phát ra áp lực ma lực cấp ${selected.level}.`,
        skills: ["Tấn công chớp nhoáng", "Phun Độc/Ngọn Lửa"],
        isWeakened: false,
        dropItems: [selected.drops]
      };

      narrative = `Bụi rậm rung chuyển dữ dội! Từ cõi u tối của Rừng Lớn Jura, một ${selected.name} xuất hiện với ánh mắt đỏ rực. Bảng cảnh báo nguy hiểm hiện lên!`;
      
      suggestedActions = [
        `Dùng Kỹ năng Độc nhất tấn công ${selected.name}`,
        "Tấn công vật lý dồn ép mục tiêu",
        "Phòng thủ và phân tích nhược điểm",
        "Kích hoạt Thôn Phệ khi đối phương yếu máu"
      ];
    } else {
      // In combat
      const dmg = Math.floor(Math.random() * 25) + 20;
      const enemyDmg = Math.floor(Math.random() * 15) + 5;
      const newEnemyHp = Math.max(0, currentEnemy.hp - dmg);
      
      hpChange = -enemyDmg;

      if (newEnemyHp <= 0) {
        narrative = `Bằng một đòn giáng hiểm hóc, bạn đã đả bại ${currentEnemy.name}! Ma vật gục xuống, ma lượng bắt đầu tan biến. Đây là thời cơ tốt nhất để Thôn Phệ!`;
        nextEnemy = {
          ...currentEnemy,
          hp: 0,
          isWeakened: true
        };

        worldVoiceAnnouncements.push(
          `░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░\n[GIỌNG NÓI THẾ GIỚI]: Đã xác nhận... ${currentEnemy.name} đã rơi vào trạng thái gục ngã. Có thể thực hiện Thôn Phệ!\n░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░`
        );

        suggestedActions = [
          `Thôn Phệ ${currentEnemy.name} thu thập kỹ năng`,
          "Thu thập nguyên liệu ma vật",
          "Nghỉ ngơi hồi phục HP/MP",
          "Tiếp tục đi tìm quái vật khác"
        ];
      } else {
        const isWeak = newEnemyHp < currentEnemy.maxHp * 0.4;
        nextEnemy = {
          ...currentEnemy,
          hp: newEnemyHp,
          isWeakened: isWeak
        };

        narrative = `Bạn tung đòn đánh gây ${dmg} sát thương lên ${currentEnemy.name}! Đối phương gầm lên căm hờn, đáp trả khiến bạn mất ${enemyDmg} HP. ${isWeak ? 'Kẻ thù đã thở dốc và yếu máu!' : ''}`;
        
        suggestedActions = [
          isWeak ? `Thôn Phệ ${currentEnemy.name} ngay lập tức` : `Tung đòn dứt điểm ${currentEnemy.name}`,
          `Dùng Kỹ năng Độc nhất bộc phá ma lực`,
          "Phòng thủ kiên cố hồi MP",
          "Rút lui an toàn"
        ];
      }
    }
  } 
  // Case 3: Gather resources / Khai thác
  else if (actLower.includes("khai thác") || actLower.includes("thảo dược") || actLower.includes("quặng") || actLower.includes("cỏ")) {
    itemsGained.push({
      id: `item_herb_${Date.now()}`,
      name: "Cỏ Hipokute Linh Thiêng",
      quantity: 3,
      description: "Thảo dược quý hiếm chứa ma lượng dồi dào, dùng để chế Thuốc Hồi Phục Hoàng Gia.",
      type: "Herb"
    });
    itemsGained.push({
      id: `item_ore_${Date.now()}`,
      name: "Quặng Ma Ngân (Magisteel)",
      quantity: 2,
      description: "Quặng kim loại ma thuật siêu bền, nguyên liệu rèn vũ khí cao cấp.",
      type: "Ore"
    });

    narrative = `Bạn tỉ mỉ thu thập được 3 Cỏ Hipokute Linh Thiêng và 2 khối Quặng Ma Ngân Magisteel sáng nhấp nháy ma lực dưới vách đá. Trong quá trình hấp thụ dược tính, cơ thể bạn ngấm ma lực tự nhiên.`;

    worldVoiceAnnouncements.push(
      `░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░\n[GIỌNG NÓI THẾ GIỚI]: Đã xác nhận... Thu thập Cỏ Hipokute đậm đặc. Tăng giới hạn Ma Lượng MP +10!\n░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░`
    );

    hpChange = 15;
    mpChange = 25;

    suggestedActions = [
      "Dùng Kỹ năng Độc nhất chiết xuất Thuốc Hồi Phục",
      "Mang quặng về rèn vũ khí nâng cấp Lãnh địa",
      "Săn ma vật trong hang động",
      "Mở rộng khảo sát khu vực mới"
    ];
  }
  // Case 4: Upgrade Territory / Nâng cấp Lãnh địa
  else if (actLower.includes("lãnh địa") || actLower.includes("xây") || actLower.includes("làng") || actLower.includes("nâng cấp")) {
    territoryChanges = {
      levelIncrease: 1,
      newBuildings: ["Xưởng Rèn Kaijin", "Hàng Rào Phòng Thủ Ma Thuật"],
      populationIncrease: 15,
      prosperityChange: 100
    };

    narrative = `Bạn kêu gọi các cư dân trong lãnh địa cùng bắt tay xây dựng! Xưởng Rèn Kaijin chính thức đi vào hoạt động cùng Hàng Rào Phòng Thủ Ma Thuật. Binh sĩ Goblin và Rồng/Quỷ Nhân hào hứng gia nhập, giúp dân số gia tăng!`;

    worldVoiceAnnouncements.push(
      `░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░\n[GIỌNG NÓI THẾ GIỚI]: Đã xác nhận... Lãnh địa tiến hóa thành Cấp ${character.territory.level + 1}! Gia tăng Danh Tiếng và Uy Áp Ma Vương!\n░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░`
    );

    suggestedActions = [
      "Phân công cư dân đi tuần tra và săn bắn",
      "Chiêu mộ thêm các bộ tộc ma vật lân cận",
      "Đi săn ma vật cấp cao mở rộng lãnh thổ",
      "Chế tạo trang bị Ma Ngân cho quân đội"
    ];
  }
  // Case 5: Default Unique Skill or Custom action
  else {
    narrative = `Bạn thực hiện hành động: "${action}". Sóng ma lực cuộn trào theo từng chuyển động của bạn. Thế giới xung quanh biến đổi sinh động theo ý chí của bạn.`;
    
    worldVoiceAnnouncements.push(
      `░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░\n[GIỌNG NÓI THẾ GIỚI]: Đã xác nhận... Tăng cường độ thuần thục Kỹ năng Độc nhất [${character.skills.find((s: any) => s.category === 'Unique')?.name || 'Kỹ năng Độc Nhất'}]!\n░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░`
    );

    mpChange = 10;
    hpChange = 10;

    suggestedActions = [
      "Đi săn ma vật kiểm tra sức mạnh",
      "Khai thác tài nguyên quý hiếm",
      "Nâng cấp xây dựng Lãnh địa Tempest",
      "Thực hiện Thôn Phệ hấp thụ ma lực"
    ];
  }

  return {
    narrative,
    worldVoiceAnnouncements,
    newSkills,
    newResistances,
    hpChange,
    mpChange,
    itemsGained,
    territoryChanges,
    combatEnemy: nextEnemy,
    locationUpdate: newLocation,
    suggestedActions,
    isDevourSuccess
  };
}

// Start Server with Vite Middleware in Dev
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Tensura RPG Game Master Server listening on http://localhost:${PORT}`);
  });
}

startServer();
