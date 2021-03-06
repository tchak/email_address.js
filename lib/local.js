class Local {
  constructor(localString, config={}) {
    this.original  = localString;
    this.config    = config;
    this.valid     = true;
    this.errorCode = null;
    this.parse();
    this.isValid();
  }

  /****************************************************************************
  /* Operations and Validations
  /****************************************************************************/

  data() {
    return {
      local: this.original,
      mailbox: this.mailbox,
      account: this.account,
      tag: this.tag,
      valid: this.valid,
      errorCode: this.errorCode
    }
  }

  toString(format) {
    return this.original;
  }

  isValid() {
    this.errorCode = null;
    var str = this.toString();
    if (str.length < this.config.localSize[0]) return this.setError("localTooShort");
    if (str.length > this.config.localSize[1]) return this.setError("localTooLong");
    return this.valid = true;
  }

  setError(errorCode) {
    //console.log('ERR', this.original, errorCode);
    this.valid = false;
    this.errorCode = errorCode;
    return false;
  }

  error() {
    return this.valid ? null : this.errorCode;
  }

  canonical() {
    if (this.config.mailboxCanonical) {
      return this.config.mailboxCanonical(this.mailbox);
    } else {
      return this.mailbox;
    }
  }

  /****************************************************************************
  /* Operations and Validations
  /****************************************************************************/

  // Parses the original local part (left of @). Sets:
  // * leadingComment    - Includes parens
  // * mailbox           - account+tag, no comments
  // * account           - mailbox without tag
  // * tag               - after tag separator (+)
  // * trailingComment   - Includes parens
  parse() {
    this.mailbox  = this.original;
    this.tag = null;
    this.parseComments();
  }

  lowerCase() {
    this.mailbox = this.mailbox.toLowerCase();
  }

  splitTag() {
    let tagAt = this.mailbox.indexOf(this.config.tagSeparator);
    if (tagAt > 0) {
      this.tag     = this.mailbox.substr(tagAt + 1);
      this.account = this.mailbox.substr(0, tagAt);
    } else {
      this.account = this.mailbox;
    }
  }

  parseComments() {
    var leadingComment = /^((\(.*?)(?:(?<!\\))\))(.*)$/;
    var match = leadingComment.exec(this.mailbox);
    if (match !== null) {
      this.leadingComment = match[1];
      this.mailbox       = match[2];
    }

    var trailingComment = /^(.*)(\(\.*?(?:(?<!\\))\))$/;
    match = trailingComment.exec(this.mailbox);
    if (match !== null) {
      this.trailingComment= match[2];
      this.mailbox       = match[1];
    }
  }

}

module.exports = Local;
