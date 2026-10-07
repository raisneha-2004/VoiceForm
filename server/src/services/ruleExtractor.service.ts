import type { IFormField, VoiceCommandType, ExtractedUpdate } from '../types/index.js';

export interface RuleExtractionResult {
  hasCommand: boolean;
  commands: Array<{
    type: VoiceCommandType;
    fieldKey?: string;
    value?: any;
  }>;
  updates: ExtractedUpdate[];
}

export class RuleExtractorService {
  /**
   * Resolves field key by finding exact or fuzzy match in labels and keys
   */
  static findFieldByLabelOrKey(identifier: string, fields: IFormField[]): IFormField | undefined {
    const clean = identifier.toLowerCase().replace(/[^a-z0-9]/g, '');

    // 1. Exact match on key
    const byKey = fields.find((f) => f.key.toLowerCase() === identifier.toLowerCase());
    if (byKey) return byKey;

    // 2. Exact match on label
    const byLabel = fields.find((f) => f.label.toLowerCase() === identifier.toLowerCase());
    if (byLabel) return byLabel;

    // 3. Keyword / partial match
    return fields.find((f) => {
      const fieldKeyClean = f.key.toLowerCase().replace(/[^a-z0-9]/g, '');
      const fieldLabelClean = f.label.toLowerCase().replace(/[^a-z0-9]/g, '');

      if (clean === 'name' || clean === 'fullname') {
        return fieldKeyClean.includes('name') || fieldLabelClean.includes('name');
      }
      if (clean === 'city' || clean === 'location') {
        return fieldKeyClean.includes('city') || fieldLabelClean.includes('city');
      }
      if (clean === 'age' || clean === 'dob' || clean === 'birth') {
        return fieldKeyClean.includes('age') || fieldKeyClean.includes('dob');
      }
      if (clean === 'email' || clean === 'mail') {
        return f.type === 'email' || fieldKeyClean.includes('email');
      }
      if (clean === 'phone' || clean === 'mobile' || clean === 'contact') {
        return f.type === 'phone' || fieldKeyClean.includes('phone') || fieldKeyClean.includes('mobile');
      }

      return (
        fieldLabelClean.includes(clean) ||
        clean.includes(fieldLabelClean) ||
        fieldKeyClean.includes(clean)
      );
    });
  }

  /**
   * Detects deterministic commands from transcript
   */
  static extractCommands(transcript: string, fields: IFormField[]): Array<{ type: VoiceCommandType; fieldKey?: string; value?: any }> {
    const t = transcript.trim().toLowerCase();
    const commands: Array<{ type: VoiceCommandType; fieldKey?: string; value?: any }> = [];

    // Next field commands
    if (/\b(next field|next|agla field|aage badho|aage)\b/i.test(t)) {
      commands.push({ type: 'NEXT_FIELD' });
      return commands;
    }

    // Previous field commands
    if (/\b(previous field|previous|prev|pichla field|peeche)\b/i.test(t)) {
      commands.push({ type: 'PREV_FIELD' });
      return commands;
    }

    // Review form commands
    if (/\b(review my form|review form|review|check form|form dikhao|recheck)\b/i.test(t)) {
      commands.push({ type: 'REVIEW' });
      return commands;
    }

    // Submit form commands
    if (/\b(submit form|submit my form|submit|jama karo|complete form)\b/i.test(t)) {
      commands.push({ type: 'SUBMIT' });
      return commands;
    }

    // Clear field commands (e.g. "clear email", "delete city", "email hata do")
    const clearMatch = t.match(/\b(?:clear|delete|remove|erase|hatao|hata do)\s+([a-zA-Z\s]+?)(?:\s+field)?$/i);
    if (clearMatch) {
      const fieldRef = clearMatch[1].trim();
      const matchedField = this.findFieldByLabelOrKey(fieldRef, fields);
      if (matchedField) {
        commands.push({ type: 'CLEAR_FIELD', fieldKey: matchedField.key });
        return commands;
      }
    }

    return commands;
  }

  /**
   * Extracts values deterministically via regex & linguistic patterns
   */
  static extractDeterministicUpdates(
    transcript: string,
    fields: IFormField[],
    activeFieldKey?: string
  ): ExtractedUpdate[] {
    const updates: ExtractedUpdate[] = [];
    const t = transcript.trim();

    // 1. Correction patterns: e.g. "Change my city to Delhi", "My age is 22, not 21"
    const changeMatch = t.match(/(?:change|update|set)\s+(?:my\s+)?([a-zA-Z\s]+?)\s+to\s+([^,.]+)/i);
    if (changeMatch) {
      const fieldIdent = changeMatch[1].trim();
      const rawVal = changeMatch[2].trim();
      const field = this.findFieldByLabelOrKey(fieldIdent, fields);
      if (field) {
        updates.push({
          fieldKey: field.key,
          value: rawVal,
          confidence: 0.95,
          requiresConfirmation: Boolean(field.isSensitive),
          reasoning: `Correction pattern: change ${field.label} to ${rawVal}`
        });
      }
    }

    const notMatch = t.match(/(?:my\s+)?([a-zA-Z\s]+?)\s+(?:is|to|h)\s+([^,.]+?)(?:,\s*not|\s+na ki|\s+nahi)\s+[^,.]+/i);
    if (notMatch) {
      const fieldIdent = notMatch[1].trim();
      const rawVal = notMatch[2].trim();
      const field = this.findFieldByLabelOrKey(fieldIdent, fields);
      if (field && !updates.some((u) => u.fieldKey === field.key)) {
        updates.push({
          fieldKey: field.key,
          value: rawVal,
          confidence: 0.94,
          requiresConfirmation: Boolean(field.isSensitive),
          reasoning: `Correction pattern: ${field.label} is ${rawVal}`
        });
      }
    }

    // 2. Email extraction
    const emailField = fields.find((f) => f.type === 'email');
    if (emailField && !updates.some((u) => u.fieldKey === emailField.key)) {
      // Normal email regex
      const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i;
      const emailMatch = t.match(emailRegex);

      if (emailMatch) {
        updates.push({
          fieldKey: emailField.key,
          value: emailMatch[1].toLowerCase(),
          confidence: 0.98,
          requiresConfirmation: Boolean(emailField.isSensitive),
          reasoning: 'Direct regex match for email'
        });
      } else {
        // Spoken email: "sneharai at gmail dot com" or "sneharai at gmail . com"
        const spokenEmailMatch = t.match(/([a-zA-Z0-9._%+-]+)\s+at\s+([a-zA-Z0-9.-]+)\s+(?:dot|\.)\s+([a-zA-Z]{2,})/i);
        if (spokenEmailMatch) {
          const userPart = spokenEmailMatch[1].replace(/\s+/g, '').toLowerCase();
          const domainPart = spokenEmailMatch[2].replace(/\s+/g, '').toLowerCase();
          const tldPart = spokenEmailMatch[3].replace(/\s+/g, '').toLowerCase();
          const constructed = `${userPart}@${domainPart}.${tldPart}`;
          updates.push({
            fieldKey: emailField.key,
            value: constructed,
            confidence: 0.92,
            requiresConfirmation: Boolean(emailField.isSensitive),
            reasoning: 'Spoken email extraction'
          });
        }
      }
    }

    // 3. Phone number extraction
    const phoneField = fields.find((f) => f.type === 'phone');
    if (phoneField && !updates.some((u) => u.fieldKey === phoneField.key)) {
      const phoneRegex = /(?:\+91|0)?\s*[6-9]\d{4}\s*\d{5}/;
      const phoneMatch = t.match(phoneRegex);
      if (phoneMatch) {
        const cleanedPhone = phoneMatch[0].replace(/\s+/g, '');
        updates.push({
          fieldKey: phoneField.key,
          value: cleanedPhone.startsWith('+') ? cleanedPhone : `+91 ${cleanedPhone.slice(-10)}`,
          confidence: 0.96,
          requiresConfirmation: Boolean(phoneField.isSensitive),
          reasoning: 'Direct regex match for phone number'
        });
      }
    }

    // 4. Age or numeric year extraction
    const ageField = fields.find((f) => f.key.toLowerCase().includes('age') || f.label.toLowerCase().includes('age'));
    if (ageField && !updates.some((u) => u.fieldKey === ageField.key)) {
      const ageMatch = t.match(/(?:i am|age is|umar|age)\s+(\d{1,3})(?:\s+years\s+old|\s+saal)?/i);
      if (ageMatch) {
        updates.push({
          fieldKey: ageField.key,
          value: Number(ageMatch[1]),
          confidence: 0.95,
          requiresConfirmation: Boolean(ageField.isSensitive),
          reasoning: 'Pattern match for age'
        });
      }
    }

    // 5. Name extraction (e.g. "My name is Sneha Rai", "Mera naam Sneha Rai hai")
    const nameField = fields.find((f) => f.key.toLowerCase().includes('name') || f.label.toLowerCase().includes('name'));
    if (nameField && !updates.some((u) => u.fieldKey === nameField.key)) {
      const nameMatch = t.match(/(?:my name is|mera naam|name is)\s+([a-zA-Z\s]+?)(?=\s+(?:and|my|i|email|phone|city|dob|age|living|from|hai)\b|\s*[,.]|$)/i);
      if (nameMatch) {
        const extractedName = nameMatch[1].trim();
        // Avoid extracting numeric ages or empty strings as name
        if (extractedName && !/^\d+$/.test(extractedName)) {
          updates.push({
            fieldKey: nameField.key,
            value: extractedName,
            confidence: 0.94,
            requiresConfirmation: Boolean(nameField.isSensitive),
            reasoning: 'Pattern match for full legal name'
          });
        }
      }
    }

    // 6. City or residence extraction (e.g. "I live in Noida", "Rehta hu Delhi me", "city is Noida")
    const cityField = fields.find((f) => f.key.toLowerCase().includes('city') || f.label.toLowerCase().includes('city'));
    if (cityField && !updates.some((u) => u.fieldKey === cityField.key)) {
      const cityMatch = t.match(/(?:live in|from|city is|rehta hu|shehar(?:\s+hai)?)\s+([a-zA-Z\s]+?)(?=\s+(?:and|my|i|email|phone|hai)\b|\s*[,.]|$)/i);
      if (cityMatch) {
        const extractedCity = cityMatch[1].trim();
        if (extractedCity) {
          updates.push({
            fieldKey: cityField.key,
            value: extractedCity,
            confidence: 0.92,
            requiresConfirmation: Boolean(cityField.isSensitive),
            reasoning: 'Pattern match for city of residence'
          });
        }
      }
    }

    // 7. If there's an activeFieldKey and no multi-field updates were extracted, treat the whole transcript as value for activeFieldKey
    if (updates.length === 0 && activeFieldKey) {
      const activeField = fields.find((f) => f.key === activeFieldKey);
      if (activeField) {
        let val: any = t;
        if (activeField.type === 'number') {
          const numMatch = t.match(/\d+/);
          if (numMatch) val = Number(numMatch[0]);
        } else if (activeField.type === 'checkbox') {
          val = /^(yes|haan|true|agree|definitely|sure)$/i.test(t);
        }
        updates.push({
          fieldKey: activeField.key,
          value: val,
          confidence: 0.9,
          requiresConfirmation: Boolean(activeField.isSensitive),
          reasoning: `Direct speech targeted to active field '${activeField.label}'`
        });
      }
    }

    return updates;
  }
}
