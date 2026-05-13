import json
import os
import unicodedata

def strip_accents(s):
    """Remove acentos de uma string."""
    return ''.join(c for c in unicodedata.normalize('NFD', s)
                  if unicodedata.category(c) != 'Mn')

def clean_for_filename(s):
    """Limpa a string para usar em nomes de arquivos (sem espaços, sem acentos, TitleCase)."""
    s = strip_accents(s)
    # Remove parênteses e outros caracteres que possam ter sobrado
    s = s.replace("(", "").replace(")", "").replace("/", "").replace(",", "")
    return s.title().replace(" ", "")


# Dados do documento APÊNDICE 4
data = [
    {
        "clan_name": "BOE ETUIEDAGAMAGE",
        "clan_id": "boe_etuiedagamage",
        "data": {
            "KIEGE": ["Nabure (ararapiranga)", "Batagaje (biguá)", "Korao (papagaio verdadeiro)", "Bakuguma (gavião requinta)", "Metugo (pomba)", "Turubare (pato)", "Kanao Kigadureu", "Mano (gavião)", "Tamigi (anhuma)"],
            "BAREGE": ["Jugo (queixada)", "Jui (caititu)", "Okwa (lobinho)", "Ipocereu (papa mel)", "Meridabo (furão)", "Moribo (cachorro do mato)", "Kudobo (quati)", "Ipie (ariranha)", "Jomo (lontra)", "Ierarai (mão pelada)", "Aokurumodu (lontra)"],
            "AWAGE": ["Bakorororeu (cobra coral)", "Arori (cobra coral)", "Aroro (larva de borboleta)", "Aroro Ekureu (lavra de borboleta amarelo)", "Aroro Ewagureu"]
        }
    },
    {
        "clan_name": "AROROE",
        "clan_id": "aroroe",
        "data": {}
    },
    {
        "clan_name": "IWAGUDUDOGE",
        "clan_id": "iwagududoge",
        "data": {
            "BAREGE": ["Akiwa (capivara)", "Akiwareu (rato)", "Kurugo (preá)", "Rie (lobo)", "Arigao coreu (cachorro preto)"],
            "KARE": ["Araru (piraputanga)", "Ararureuge (tipo de lambari)", "Jarudo Biagareu (bagre pequeno)"],
            "KIEGE": ["Kujekadureu (mutum fêmea)", "Ceje (gavião fumaça)", "Keago (gavião fumaça castanho)", "Keago Kigadureu", "Mukureabo (curiango)", "Piroje (andorinha)", "Piududu (beija flor)", "Piududu Kudorereu (beija flor parecido com arara azul)", "Piuguriwu", "Ciwajereu", "Warinogo (variedade de gavião)", "Kido (periquito)", "Kidetumana (periquito vassourinha)", "Keao-Keao Kigadureu (grainha)", "Cucu", "Kidoreu (sanhaço)", "Karao", "Aere (mãe da lua)", "Pogubo", "Pobureu (urubu)", "Ciwaje (urubu cangaia)", "Cenao Taotao (gralhão)"]
        }
    },
    {
        "clan_name": "APIBOREGE",
        "clan_id": "apiborege",
        "data": {
            "KIEGE": ["Aroe Eceba (gavião real)", "Kuruguga (gavião)", "Torowa", "Kuruguga Porireu", "Kuruguga Awarare", "Kuruguga Kudagodoreu", "Kurugugabokwadiare", "Tawie (gaivota)", "Tudu (caburé)", "Beo (siriema)", "Cugui (tucaninho)"],
            "AWAGE": ["Ikuiemana"],
            "BAREGE": ["Atomoio (jabuti)", "Bakuie", "Irui (sinimbu)", "Aipoboreu (jaguatirica)"],
            "KARE": ["Roko (curimbatá)", "Akurara (pacu peba)", "Buruwo (savá)", "Apuie (tipo de lambari pequeno)", "Tubore (lambari)", "Metoe", "Motoreu (sardinha)", "Koduraka", "Atu (madre pérola)", "Aturebo", "Atunabo", "Bakororo kuidabireu"]
        }
    },
    {
        "clan_name": "PAIWOE",
        "clan_id": "paiwoe",
        "data": {
            "KIEGE": ["Kuido (arara amarelo)", "Keakorogu (ararinha)", "Kuno (papagaio campeiro)", "Ore (periquito estrela)", "Kugu (gavião)", "Bokurowodo", "Kurutui", "Manopa (variedade de ararinha)", "Piabo", "Ciwabo (guachão)", "Ciwabo Batarea Keadureu (chechéu)", "Batagaje (mergulhão bivá)", "Aturuwareu (tipo de bivá)", "Makao (acuã)", "Tagogo (coruja)", "Curui (papagaio urubuzinho)", "Turubare coreu (pato preto)"],
            "BAREGE": ["Paicoreu (bugio preto)", "Paiparagujagureu (bugio de peito avermelhado)", "Iwe (ouriço)", "Meaibo (macaco barriga)", "Rie (lobo guará)", "Jerigige (jabuti)", "Ato (jabuti grande da mata)", "Buke (tamanduá bandeira)", "Apogo (tamanduá mirin)", "Aimeareu (gato mourisco)", "Mea (cutia)", "Ru (sapo)"],
            "KARE": ["Orari (pintado)", "Orariji (surubim)", "Poru (jaú)", "Koma (jeripoca)", "Akoro (bico de pato)", "Rureo (palmito)", "Porugogo (tipo de peixe de couro bagre)", "Barubado", "Kudogo (botoado)", "Juireu (variedade de botoado)", "Nowareu (mandi banana)", "Rekudo (chicote)", "Okwaboareu (cascudo)"]
        }
    },
    {
        "clan_name": "BAKORO ECERAE",
        "clan_id": "bakoro_ecerae",
        "data": {
            "BAREGE": ["Adugo (onça pintada)", "Adugo Coreu (onça preta)", "Okwaru (tatu peba)", "Enokuri (tatu bolinha)", "Jerego (tatu china)"],
            "KARE": ["Je Kujagureu (piau)", "Jetobo (tipo de piau)", "Aenogwa (tipo de piau)", "Kare Etumana", "Oicereu (matrinchã)", "Buiogo (piranha)", "Buiogo merireu (variedade de piranha)"]
        }
    },
    {
        "clan_name": "BOKODORI ECERAE",
        "clan_id": "bokodori_ecerae",
        "data": {
            "BAREGE": ["Bokodori (tatu canastra)", "Bokodorireu (tipo de tatu canastra)", "Iturawore (tipo de tatu)", "Okugudo (tipo de tatu)", "Enogikure", "Arigao Kigadureu (cachorro branco)", "Tapiradoge (vaca)", "Kowarodoge (cavalo)", "Jugureuge (porco doméstico)"],
            "KIEGE": ["Maragatao", "Pogo (Anu branco)", "Kogarigadoge (galinha)", "Kurea Kurea (joão de barro)", "Juregori (tipo de ave pequeno)", "Cibae (arara canindé)", "Turubare kigadureu (pato branco)", "Bataru (joão pinto)", "kagariga kigadureu (galinha branca)", "Turubare kigadureu (pato branco)"],
            "KARE": ["Koge (Dourado)"]
        }
    },
    {
        "clan_name": "KIE",
        "clan_id": "kie",
        "data": {
            "BAREGE": ["Ki (anta)", "Apu (paca)", "Pobogo (veado)", "Amo (coelho)", "Upe (cágado)", "Jure (sucuri)", "Jure marido (sucuri tocó)", "Bokodori coreu (tipo de tatu canastra preto)", "Jugo (queixada)"],
            "KIEGE": ["Apodo oto coreu (tucano do bico preto)", "Apodo (tucano)", "Bataro Coreu (joão pinto preto)", "Buroibe (pavãozinho)", "Kudoro (arara azul)", "Kuritaga (papagaio corneteiro)", "Pari (ema)", "Ó (socó)", "Bai (urubu rei)"],
            "KARE": ["Kudorowu", "Paretoboreu (tipo de bagre mandi mansão cascudo)", "Butore", "Bai coreu (casa escura)", "Bai kigadureu (casa branca)", "Okoge coreu (tipo de dourado preto)"]
        }
    },
    {
        "clan_name": "BADOJEBA",
        "clan_id": "badojeba",
        "data": {
            "BAREGE": ["Adugo onaregedu (filhote de onça)", "Rea (tatu galinha)", "Okwa (raposa)", "Uwai (jacaré)"],
            "KARE": ["Koge Bakororo", "Jatugugo", "Reko", "Uto", "Pobu (pacu)"],
            "KIEGE": ["Bacekoguio", "Baruge", "Enari", "Keakorogu Ao Baru Kadureu (araçã de cabeça listrada da cor do céu)", "Meri (tié-fogo)", "Ori (anu preto)", "O (tipo de garça)", "Mutum rabo pampa", "Martim pescador", "Barugi (gavião fumaça)"]
        }
    }
]

# Configurações de caminhos
CLANS_ASSETS_DIR = "src/assets/clans"
GENERIC_IMAGE = "/animals/animal_generico.webp"

def format_name_for_id(name):
    """Formata o nome em português para uso em IDs, removendo espaços e caracteres especiais."""
    # Remove acentos e caracteres especiais para IDs consistentes
    s = strip_accents(name).lower()
    return s.replace(" ", "_").replace("(", "").replace(")", "").replace("/", "").replace(",", "").replace("-", "_")

clan_colors = {
    "PAIWOE": "#b52323", "APIBOREGE": "#b52323", "BOE ETUIEDAGAMAGE": "#b52323",
    "IWAGUDUDOGE": "#b52323", "AROROE": "#b52323", "BAKORO ECERAE": "#000000",
    "BOKODORI ECERAE": "#000000", "KIE": "#000000", "BADOJEBA": "#000000"
}

result_json = {"clans": [], "items": []}

# --- LÓGICA PARA PROCESSAR ITENS E CLÃS ---

# 1. Mapear dados existentes para busca
all_hardcoded_items = []
for clan_entry in data:
    c_name = clan_entry["clan_name"]
    c_id_suffix = clan_entry["clan_id"]
    if "data" in clan_entry:
        for cat, items in clan_entry["data"].items():
            for it in items:
                parts = it.split('(')
                b_name = parts[0].strip()
                p_name = parts[1].replace(')', '').strip() if len(parts) > 1 else b_name
                all_hardcoded_items.append({
                    "boe": b_name,
                    "port": p_name,
                    "clean_boe": clean_for_filename(b_name),
                    "clean_port": clean_for_filename(p_name),
                    "clan": c_name,
                    "clan_id_suffix": c_id_suffix
                })

# 2. Processar Clãs
import re

for clan_entry in data:
    clan_name = clan_entry["clan_name"]
    clan_id_suffix = clan_entry["clan_id"]
    clan_id = f"clan_{clan_id_suffix}"
    result_json["clans"].append({"id": clan_id, "name": clan_name})

    clan_folder = os.path.join(CLANS_ASSETS_DIR, clan_name)
    color = clan_colors.get(clan_name, "#333333")

    if clan_name == "PAIWOE":
        # Caso especial PAIWOE: Mantém itens do hardcoded com imagem genérica
        for item_info in [i for i in all_hardcoded_items if i["clan"] == clan_name]:
            item_id = f"item_{format_name_for_id(item_info['port'])}_{item_info['clan_id_suffix']}"
            result_json["items"].append({
                "id": item_id,
                "name": item_info["port"],
                "name_boe": item_info["boe"],
                "icon": "",
                "correct_clan_id": clan_id,
                "color": color,
                "clan": clan_name,
                "media": {
                    "image": GENERIC_IMAGE
                }
            })
    elif os.path.exists(clan_folder):
        # Outros clãs: Apenas se houver imagem
        for filename in os.listdir(clan_folder):
            if filename.lower().endswith(".webp"):
                # Tenta extrair nomes do arquivo: Boe_Port.webp
                name_parts = filename.replace(".webp", "").split("_")
                if len(name_parts) >= 2:
                    file_boe_clean = name_parts[0]
                    file_port_clean = name_parts[1]
                else:
                    file_boe_clean = name_parts[0]
                    file_port_clean = name_parts[0]

                # Tenta casar com o hardcoded para pegar nomes bonitos (com acento/espaço)
                match = None
                for h_item in all_hardcoded_items:
                    if h_item["clan"] == clan_name:
                        if (h_item["clean_boe"] == file_boe_clean and h_item["clean_port"] == file_port_clean) or \
                           (h_item["clean_boe"] == file_port_clean and h_item["clean_port"] == file_boe_clean):
                            match = h_item
                            break
                
                if match:
                    name_boe = match["boe"]
                    name_port = match["port"]
                else:
                    # Se não achar, usa os nomes do arquivo tentando separar camelCase
                    def split_camel(s):
                        return re.sub(r'([a-z])([A-Z])', r'\1 \2', s)
                    name_boe = split_camel(file_boe_clean)
                    name_port = split_camel(file_port_clean)

                item_id = f"item_{format_name_for_id(name_port)}_{clan_id_suffix}"
                
                # Caminho da imagem: usando o caminho relativo para src/assets
                final_img_path = f"/src/assets/clans/{clan_name}/{filename}"

                result_json["items"].append({
                    "id": item_id,
                    "name": name_port,
                    "name_boe": name_boe,
                    "icon": "",
                    "correct_clan_id": clan_id,
                    "color": color,
                    "clan": clan_name,
                    "media": {
                        "image": final_img_path
                    }
                })

# Salvar o JSON
output_path = "public/game-data.json"
with open(output_path, "w", encoding="utf-8") as json_file:
    json.dump(result_json, json_file, ensure_ascii=False, indent=2)

print(f"Arquivo '{output_path}' atualizado!")
print(f"Total de clãs: {len(result_json['clans'])}")
print(f"Total de itens: {len(result_json['items'])}")