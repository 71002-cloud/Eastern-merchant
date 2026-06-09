package org.easternmerchantfv.core;

import net.labymod.api.addon.LabyAddon;
import net.labymod.api.models.addon.annotation.AddonMain;
import org.easternmerchantfv.core.listener.ChatListener;

@AddonMain
public class EasternMerchantFvAddon extends LabyAddon<EasternMerchantFvConfiguration> {

  @Override
  protected void enable() {
    this.registerSettingCategory();

    this.registerListener(new ChatListener(this));

    this.logger().info("Enabled Eastern Merchant FV addon");
  }

  @Override
  protected Class<EasternMerchantFvConfiguration> configurationClass() {
    return EasternMerchantFvConfiguration.class;
  }
}
