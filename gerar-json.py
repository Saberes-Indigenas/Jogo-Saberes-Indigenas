import json

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

def format_name_for_id(name):
    """Formata o nome em português para uso em IDs, removendo espaços e caracteres especiais."""
    return name.lower().replace(" ", "_").replace("(", "").replace(")", "").replace("/", "").replace(",", "")

clan_colors = {
    "PAIWOE": "#b52323", "APIBOREGE": "#b52323", "BOE ETUIEDAGAMAGE": "#b52323",
    "IWAGUDUDOGE": "#b52323", "AROROE": "#b52323", "BAKORO ECERAE": "#000000",
    "BOKODORI ECERAE": "#000000", "KIE": "#000000", "BADOJEBA": "#000000"
}

result_json = {"clans": [], "items": []}

item_symbols = {
    "onça pintada": "🐆", "anta": "🫎", "arara amarelo": "🦜", "paca": "🐀",
    "jabuti": "🐢", "cobra coral": "🐍", "tatu canastra": "🦔", "dourado": "🐟",
    "ararapiranga": "🦜", "pato": "🦆", "bugio preto": "🐒", "queixada": "🐗",
    "coruja": "🦉", "pintado": "🐠", "piranha": "🐟", "urubu": "🦅",
    "gavião": "🦅", "lobo": "🐺", "papagaio verdadeiro": "🦜", "macaco barriga": "🐒",
    "lontra": "🦦", "beija flor": "🐦", "jacaré": "🐊", "raposa": "🦊",
    "sucuri": "🐍", "ema": "🦤", "tucano": "🐦", "capivara": "🦫",
    "caititu": "🐖", "tamanduá bandeira": "🐜"
}

# --- LÓGICA CORRIGIDA PARA INCLUIR O NOME BOE ---
for clan_data in data:
    clan_name_boe = clan_data["clan_name"]
    clan_id_suffix = clan_data["clan_id"]
    clan_id = f"clan_{clan_id_suffix}"
    
    # Adiciona o Clã
    result_json["clans"].append({"id": clan_id, "name": clan_name_boe})

    if "data" in clan_data and clan_data["data"]:
        for category_name_boe, items_list in clan_data["data"].items():
            for item_full_name in items_list:
                
                # Passo 1: Separar o nome Boe (antes do parênteses) e o nome em português (dentro do parênteses)
                parts = item_full_name.split('(')
                
                # O nome Boe é a parte antes do parênteses
                name_boe = parts[0].strip() 
                
                # O nome em português é a parte dentro do parênteses
                if len(parts) > 1:
                    name_portuguese = parts[1].replace(')', '').strip()
                else:
                    # Se não houver parênteses, usamos o nome Boe como nome em português (fallback)
                    name_portuguese = name_boe 

                # Passo 2: Formatar ID e determinar atributos
                item_name_formatted = format_name_for_id(name_portuguese)
                # O ID do item agora é único, combinando o nome em português formatado e o ID do clã
                item_id = f"item_{item_name_formatted}_{clan_id_suffix}"
                
                color = clan_colors.get(clan_name_boe, "#333333")
                icon = item_symbols.get(name_portuguese.lower(), "✨")

                # Passo 3: Adicionar o Item (agora incluindo 'name_boe')
                result_json["items"].append({
                    "id": item_id,
                    "name": name_portuguese,  # Nome em português
                    "name_boe": name_boe,    # Nome Boe (indígena)
                    "icon": icon,
                    "correct_clan_id": clan_id,
                    "color": color,
                    "clan": clan_name_boe
                })

# Salvar o JSON
output_path = "public/game-data.json"
with open(output_path, "w", encoding="utf-8") as json_file:
    # ensure_ascii=False garante que caracteres especiais (como emojis e acentos) são escritos corretamente
    json.dump(result_json, json_file, ensure_ascii=False, indent=2)

print(f"Arquivo '{output_path}' atualizado com todos os clãs e itens únicos, incluindo o nome BOE!")
print("\n--- Amostra do Conteúdo JSON Atualizado (Primeiros 1000 caracteres) ---")
print(json.dumps(result_json, ensure_ascii=False, indent=2)[:1000] + "\n...")