import { ActionPanel, Action, List, Image, Icon, Color } from "@raycast/api";
import { useFetch } from "@raycast/utils";

interface Bank {
  id: number;
  name: string;
  code: string;
  bin: string;
  shortName: string;
  logo: string;
  transferSupported: number;
  lookupSupported: number;
}

interface VietQRResponse {
  data: Bank[];
}

export default function Command() {
  const { isLoading, data } = useFetch<VietQRResponse>("https://api.vietqr.io/v2/banks");

  return (
    <List isLoading={isLoading} searchBarPlaceholder="Search by name, BIN, or bank code" isShowingDetail>
      {data?.data?.map((bank) => (
        <List.Item
          key={bank.id}
          icon={{ source: bank.logo, mask: Image.Mask.RoundedRect }}
          title={bank.shortName}
          keywords={[bank.bin, bank.code, bank.shortName, bank.name]}
          detail={
            <List.Item.Detail
              // Giữ markdown chỉ để hiển thị Logo cho thoáng giao diện
              markdown={`<img src="${bank.logo}" alt="${bank.shortName}" height="80" />`}
              metadata={
                <List.Item.Detail.Metadata>
                  {/* Tên đầy đủ được đặt lên đầu bảng Metadata */}
                  <List.Item.Detail.Metadata.Label title="Full Name" text={bank.name} />

                  <List.Item.Detail.Metadata.Label title="Common Name" text={bank.shortName} />

                  <List.Item.Detail.Metadata.Label title="Bank Code" text={bank.code} />

                  <List.Item.Detail.Metadata.Label title="BIN" text={bank.bin} />

                  <List.Item.Detail.Metadata.Separator />

                  <List.Item.Detail.Metadata.Label
                    title="Fast Transfer with VietQR"
                    text={bank.transferSupported ? "Supported" : "Not supported"}
                    icon={
                      bank.transferSupported
                        ? { source: Icon.CheckCircle, color: Color.Green }
                        : { source: Icon.XMarkCircle, color: Color.Secondary }
                    }
                  />

                  <List.Item.Detail.Metadata.Label
                    title="Lookup with VietQR"
                    text={bank.lookupSupported ? "Supported" : "Not supported"}
                    icon={
                      bank.transferSupported
                        ? { source: Icon.CheckCircle, color: Color.Green }
                        : { source: Icon.XMarkCircle, color: Color.Secondary }
                    }
                  />
                </List.Item.Detail.Metadata>
              }
            />
          }
          actions={
            <ActionPanel title={bank.shortName}>
              <Action.CopyToClipboard title="Copy BIN" content={bank.bin} />
              <Action.CopyToClipboard title="Copy Full Name" content={bank.name} />
              <Action.OpenInBrowser title="View in Browser" url={bank.logo} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
