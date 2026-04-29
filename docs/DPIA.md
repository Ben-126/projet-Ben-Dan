# DPIA — Analyse d'Impact sur la Protection des Données (AIPD)
## Révioria — Plateforme de quiz éducatif

**Version :** 1.0
**Date :** 29 avril 2026
**Responsable du traitement :** Ben Podrojsky — benpodrojsky@gmail.com
**Mise à jour requise si :** introduction de publicités, changement de sous-traitant, nouveau traitement de données biométriques

---

## 1. Nécessité de la DPIA

Cette DPIA est réalisée à titre préventif en raison de :
- Traitement de données de **mineurs** (lycéens, potentiellement < 15 ans)
- Traitement de données **biométriques** (audio de prononciation)
- Transferts de données vers un **pays tiers** (USA : Groq, Upstash, Vercel)
- Utilisation de l'**intelligence artificielle** pour traiter des données utilisateur

---

## 2. Description des traitements

### Traitement A — Gestion des comptes utilisateurs

| Champ | Détail |
|-------|--------|
| **Finalité** | Authentification, profil, progression |
| **Données** | Email, pseudo, XP, niveau, streak, badges, date de naissance déclarée |
| **Base légale** | Consentement (art. 6.1.a RGPD) |
| **Destinataires** | Supabase (EU — Stockholm) |
| **Durée** | Jusqu'à suppression du compte |
| **Mineurs** | Email parental stocké comme preuve de consentement |

### Traitement B — Génération de quiz par IA

| Champ | Détail |
|-------|--------|
| **Finalité** | Générer des questions adaptées au niveau |
| **Données** | Matière, chapitre, niveau scolaire, IP de l'utilisateur |
| **Base légale** | Intérêt légitime (service demandé, art. 6.1.f RGPD) |
| **Destinataires** | Groq Inc. (USA) — CCT |
| **Durée** | Traitement immédiat — non stocké |
| **Données personnelles** | IP transmise dans métadonnées HTTP |

### Traitement C — Scan de devoir (IA vision)

| Champ | Détail |
|-------|--------|
| **Finalité** | Corriger un exercice manuscrit par IA |
| **Données** | Image photographiée, IP |
| **Base légale** | Consentement explicite (art. 6.1.a RGPD) |
| **Destinataires** | Groq Inc. (USA) — CCT |
| **Durée** | Traitement immédiat — non stocké |
| **Risque** | L'image peut contenir des informations personnelles |

### Traitement D — Prononciation (audio)

| Champ | Détail |
|-------|--------|
| **Finalité** | Analyser la prononciation d'un mot ou phrase |
| **Données** | Enregistrement audio (voix), IP |
| **Base légale** | Consentement explicite (art. 6.1.a RGPD) |
| **Destinataires** | Groq/Whisper (USA) — CCT |
| **Durée** | Traitement immédiat — non stocké |
| **Risque** | Données potentiellement biométriques (voix) |

### Traitement E — Stockage local (localStorage)

| Champ | Détail |
|-------|--------|
| **Finalité** | Sauvegarder progression, performances, objectifs |
| **Données** | Historique quiz, performances, objectifs, cartes révision, gamification |
| **Base légale** | Consentement (art. 82 LIL) |
| **Destinataires** | Navigateur de l'utilisateur uniquement |
| **Durée** | Jusqu'au refus/retrait du consentement ou suppression manuelle |

### Traitement F — Rate limiting

| Champ | Détail |
|-------|--------|
| **Finalité** | Prévenir les abus (anti-DDoS, anti-scraping) |
| **Données** | Adresse IP |
| **Base légale** | Intérêt légitime (sécurité du service, art. 6.1.f RGPD) |
| **Destinataires** | Upstash Inc. (USA) — CCT |
| **Durée** | 60 secondes (expiration automatique Redis) |

---

## 3. Analyse des risques

### Risque 1 — Traitement de données de mineurs (ÉLEVÉ)

| Aspect | Évaluation |
|--------|-----------|
| **Probabilité** | Élevée (service pour lycéens, dont élèves de seconde à 15-16 ans) |
| **Gravité** | Élevée (obligations légales renforcées) |
| **Impact** | Sanction CNIL si traitement sans consentement parental valide |

**Mesures de réduction :**
- Déclaration d'âge obligatoire à l'inscription
- Email parental obligatoire pour les < 15 ans
- Email parental stocké comme preuve dans Supabase user_metadata
- Documentation dans la politique de confidentialité

**Risque résiduel :** Moyen (déclaration non vérifiable par un tiers)

---

### Risque 2 — Transfert de données audio/image vers les USA (ÉLEVÉ)

| Aspect | Évaluation |
|--------|-----------|
| **Probabilité** | Certaine (fonctionnalités scan et prononciation) |
| **Gravité** | Élevée (données potentiellement biométriques) |
| **Impact** | Non-conformité art. 44-49 RGPD si pas de CCT |

**Mesures de réduction :**
- Encadrement par CCT (Groq déclare conformité RGPD)
- Données non stockées après traitement
- Information claire dans la politique de confidentialité
- Mention "transmis à Groq USA" dans la politique

**Risque résiduel :** Moyen (dépend de la conformité réelle de Groq)

---

### Risque 3 — Adresse IP transmise à des sous-traitants USA (MOYEN)

| Aspect | Évaluation |
|--------|-----------|
| **Probabilité** | Certaine |
| **Gravité** | Faible (IP non persistée au-delà de 60s/7 jours) |
| **Impact** | Faible si CCT en place |

**Mesures de réduction :**
- CCT avec Upstash et Vercel
- Durées de conservation documentées et minimales
- Mention explicite dans la politique de confidentialité

**Risque résiduel :** Faible

---

### Risque 4 — Violation de données Supabase (MOYEN)

| Aspect | Évaluation |
|--------|-----------|
| **Probabilité** | Faible (infrastructure professionnelle) |
| **Gravité** | Élevée (emails, pseudos, données de progression) |
| **Impact** | Notification CNIL sous 72h obligatoire (art. 33 RGPD) |

**Mesures de réduction :**
- Row Level Security (RLS) activée sur toutes les tables
- Clé anonyme publique sans accès élevé
- Données sensibles non stockées en clair
- Supabase en UE (Stockholm)

**Risque résiduel :** Faible

---

### Risque 5 — Injection de contenu malveillant via IA (FAIBLE)

| Aspect | Évaluation |
|--------|-----------|
| **Probabilité** | Faible |
| **Gravité** | Faible (contenus pédagogiques uniquement) |
| **Impact** | Minimal |

**Mesures de réduction :**
- Validation Zod de toutes les réponses IA avant transmission client
- Fallback mock si réponse IA invalide
- CSP restrictive (XSS)

**Risque résiduel :** Très faible

---

## 4. Mesures globales de sécurité

| Mesure | Statut |
|--------|--------|
| HTTPS (TLS) sur toutes les communications | ✅ Implémenté |
| Headers de sécurité (HSTS, CSP, X-Frame-Options) | ✅ Implémenté |
| Row Level Security Supabase | ✅ Implémenté |
| Validation des entrées (Zod) | ✅ Implémenté |
| Rate limiting par IP (Upstash) | ✅ Implémenté |
| Consentement avant stockage localStorage | ✅ Implémenté |
| Effacement données au refus du consentement | ✅ Implémenté |
| Suppression complète au retrait du compte | ✅ Implémenté |
| Export des données (art. 20 RGPD) | ✅ Implémenté (API) |
| Vérification âge mineurs | ✅ Implémenté (email parental) |
| Documentation CCT sous-traitants USA | ✅ Documenté |
| Zero analytics/tracking | ✅ Confirmé |

---

## 5. Conclusion de la DPIA

**Décision :** Les traitements peuvent être mis en œuvre sous réserve des mesures de réduction appliquées.

**Points de vigilance prioritaires :**
1. Vérifier annuellement la conformité RGPD de Groq (CCT)
2. Mettre à jour cette DPIA avant introduction de publicités
3. Implémenter un nonce CSP à terme (remplacement de `unsafe-inline`)
4. Documenter tout nouveau traitement de données avant sa mise en production

**Prochain audit :** Avant toute introduction de fonctionnalités payantes/publicitaires

---

## 6. Registre des Activités de Traitement (RAT)

Conformément à l'article 30 du RGPD :

| N° | Traitement | Responsable | Base légale | Sous-traitants | Durée |
|----|-----------|-------------|-------------|----------------|-------|
| 1 | Gestion comptes | Ben Podrojsky | Consentement | Supabase (EU) | Durée compte |
| 2 | Génération quiz IA | Ben Podrojsky | Intérêt légitime | Groq (USA/CCT) | Immédiat |
| 3 | Scan devoir IA | Ben Podrojsky | Consentement | Groq (USA/CCT) | Immédiat |
| 4 | Prononciation audio | Ben Podrojsky | Consentement | Groq/Whisper (USA/CCT) | Immédiat |
| 5 | Stockage local progression | Ben Podrojsky | Consentement | Aucun (navigateur) | Jusqu'au refus |
| 6 | Rate limiting IP | Ben Podrojsky | Intérêt légitime | Upstash (USA/CCT) | 60 secondes |
| 7 | Logs serveur | Ben Podrojsky | Intérêt légitime | Vercel (USA/CCT) | 7 jours |

---

*Document interne — ne pas publier en ligne.*
*À conserver pendant la durée de vie du projet + 5 ans.*
